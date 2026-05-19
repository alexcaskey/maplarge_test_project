using Microsoft.AspNetCore.StaticFiles;
using TestProject.Models;

namespace TestProject.Api.Services
{
    public class FileSystemService : IFileSystemService
    {
        private readonly string _root;

        public FileSystemService(IConfiguration config)
        {
            _root = config["RootDirectory"]
                ?? throw new InvalidOperationException("RootDirectory not configured.");
        }


        // ---------------------------------------------------------------------
        // Path Safety
        // ---------------------------------------------------------------------

        public string ResolveSafePath(string relativePath)
        {
            relativePath ??= "";

            // Normalize slashes
            relativePath = relativePath.Replace('/', Path.DirectorySeparatorChar)
                                       .Replace('\\', Path.DirectorySeparatorChar);

            var combined = Path.GetFullPath(Path.Combine(_root, relativePath));

            // Prevent directory traversal
            if (!combined.StartsWith(_root, StringComparison.OrdinalIgnoreCase))
                throw new UnauthorizedAccessException("Invalid path.");

            return combined;
        }


        // ---------------------------------------------------------------------
        // Browse
        // ---------------------------------------------------------------------

        public async Task<DirectoryBrowseResult> BrowseAsync(string relativePath)
        {
            var fullPath = ResolveSafePath(relativePath);

            if (!Directory.Exists(fullPath))
                throw new DirectoryNotFoundException(fullPath);

            var dirInfo = new DirectoryInfo(fullPath);

            var folders = dirInfo.GetDirectories()
                .Select(d => new FolderItem { Name = d.Name })
                .ToList();

            var files = dirInfo.GetFiles()
                .Select(f => new FileItem
                {
                    Name = f.Name,
                    Size = f.Length
                })
                .ToList();

            var (fileCount, folderCount) = await CountItemsAsync(relativePath);
            var totalSize = await CalculateDirectorySizeAsync(relativePath);

            return new DirectoryBrowseResult
            {
                Path = relativePath,
                Folders = folders,
                Files = files,
                TotalFileCount = fileCount,
                TotalFolderCount = folderCount,
                TotalSize = totalSize
            };
        }


        // ---------------------------------------------------------------------
        // Search
        // ---------------------------------------------------------------------

        public Task<SearchResult> SearchAsync(string query)
        {
            query = query?.Trim() ?? "";
            if (query.Length == 0)
                return Task.FromResult(new SearchResult { Query = query });

            var matches = Directory.EnumerateFileSystemEntries(_root, "*", SearchOption.AllDirectories)
                .Where(path => File.Exists(path))
                .Where(path => Path.GetRelativePath(_root, path).Contains(query, StringComparison.OrdinalIgnoreCase))
                .Select(path =>
                {
                    var info = new FileInfo(path);
                    return new FileItem 
                    { 
                        Name = Path.GetRelativePath(_root, path), 
                        Size = info.Exists ? info.Length : 0 
                    };
                })
                .ToList();

            return Task.FromResult(new SearchResult
            {
                Query = query,
                Matches = matches
            });
        }


        // ---------------------------------------------------------------------
        // Upload
        // ---------------------------------------------------------------------

        public async Task UploadFileAsync(string relativePath, Stream fileStream, string fileName)
        {
            var fullDir = ResolveSafePath(relativePath);

            if (Directory.Exists(fullDir))
            {
                var fullFilePath = Path.Combine(fullDir, fileName);
                if (File.Exists(fullFilePath))
                    File.Delete(fullFilePath); // Overwrite existing file   

                using var output = File.Create(fullFilePath);
                await fileStream.CopyToAsync(output);
            }
        }


        // ---------------------------------------------------------------------
        // Download
        // ---------------------------------------------------------------------

        public Task<FileDownloadResult> DownloadFileAsync(string relativeFilePath)
        {
            var fullPath = ResolveSafePath(relativeFilePath);

            if (!File.Exists(fullPath))
                throw new FileNotFoundException(fullPath);

            var stream = File.OpenRead(fullPath);

            // Detect MIME type
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(fullPath, out var contentType))
            {
                contentType = "application/octet-stream"; // fallback
            }

            return Task.FromResult(new FileDownloadResult
            {
                Stream = stream,
                FileName = Path.GetFileName(fullPath),
                ContentType = contentType
            });
        }


        public Task MoveFileAsync(string sourceRelativePath, string targetRelativePath)
        {
            var sourceFullPath = ResolveSafePath(sourceRelativePath);
            var targetFullPath = ResolveSafePath(targetRelativePath);

            if (!File.Exists(sourceFullPath))
                throw new FileNotFoundException("Source path not found.", sourceFullPath);

            if (!Directory.Exists(targetFullPath))
                throw new DirectoryNotFoundException("Target path not found.");

            var sourceFile = new FileInfo(sourceFullPath);  
            var targetDir = targetFullPath + "\\" + sourceFile.Name;

            if (File.Exists(sourceFullPath) && Directory.Exists(targetFullPath)) 
                Directory.Move(sourceFullPath, targetDir);

            return Task.CompletedTask;
        }

        public Task DeleteFileAsync(string relativePath)
        {
            var fullPath = ResolveSafePath(relativePath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
            else
            {
                throw new FileNotFoundException("Path not found.", fullPath);
            } 
            
            return Task.CompletedTask;  
        }

        // ---------------------------------------------------------------------
        // Metadata
        // ---------------------------------------------------------------------

        public Task<long> CalculateDirectorySizeAsync(string relativePath)
        {
            var fullPath = ResolveSafePath(relativePath);

            long size = Directory.EnumerateFiles(fullPath, "*", SearchOption.AllDirectories)
                .Sum(f => new FileInfo(f).Length);

            return Task.FromResult(size);
        }

        public Task<(int fileCount, int folderCount)> CountItemsAsync(string relativePath)
        {
            var fullPath = ResolveSafePath(relativePath);

            int fileCount = Directory.EnumerateFiles(fullPath, "*", SearchOption.TopDirectoryOnly).Count();
            int folderCount = Directory.EnumerateDirectories(fullPath, "*", SearchOption.TopDirectoryOnly).Count();

            return Task.FromResult((fileCount, folderCount));
        }
    }
}