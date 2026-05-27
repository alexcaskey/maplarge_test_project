using Microsoft.AspNetCore.StaticFiles;
using TestProject.Models;

namespace TestProject.Api.Services
{
    /// <summary>
    /// Service responsible for all file system operations, including browsing directories,
    /// moving and deleting files, searching, and handling uploads/downloads.
    /// </summary>
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

        public async Task<DirectoryBrowseResult> BrowseAsync(string relativePath, CancellationToken ct)
        {
            ct.ThrowIfCancellationRequested();

            var fullPath = ResolveSafePath(relativePath);

            if (!Directory.Exists(fullPath))
                throw new DirectoryNotFoundException(fullPath);

            var dirInfo = new DirectoryInfo(fullPath);

            ct.ThrowIfCancellationRequested();
            var folders = dirInfo.GetDirectories()
                .Select(d =>
                {
                    ct.ThrowIfCancellationRequested();
                    return new FolderItem { Name = d.Name };
                }
                )
                .ToList();

            ct.ThrowIfCancellationRequested();
            var files = dirInfo.GetFiles()
                .Select(f =>
                {
                    ct.ThrowIfCancellationRequested();
                    return new FileItem
                    {
                        Name = f.Name,
                        Size = f.Length
                    };
                }
                )
                .ToList();

            return new DirectoryBrowseResult
            {
                Path = relativePath,
                Folders = folders,
                Files = files,
                TotalFileCount = files.Count,
                TotalFolderCount = folders.Count,
                TotalSize = files.Sum(f => f.Size)
            };
        }


        // ---------------------------------------------------------------------
        // Search
        // ---------------------------------------------------------------------

        public Task<SearchResult> SearchAsync(string query, CancellationToken ct)
        {
            ct.ThrowIfCancellationRequested();

            query = query?.Trim() ?? "";
            if (query.Length == 0)
                return Task.FromResult(new SearchResult { Query = query });

            var matches = new List<FileItem>();

            foreach (var path in Directory.EnumerateFiles(_root, "*", SearchOption.AllDirectories))
            {
                ct.ThrowIfCancellationRequested();

                if (Path.GetRelativePath(_root, path)
                        .Contains(query, StringComparison.OrdinalIgnoreCase))
                {
                    var info = new FileInfo(path);
                    matches.Add(new FileItem
                    {
                        Name = Path.GetRelativePath(_root, path),
                        Size = info.Length
                    });
                }
            }

            return Task.FromResult(new SearchResult
            {
                Query = query,
                Matches = matches
            });
        }


        // ---------------------------------------------------------------------
        // Upload
        // ---------------------------------------------------------------------

        public async Task UploadFileAsync(string relativePath, Stream fileStream, string fileName, CancellationToken ct)
        {
            ct.ThrowIfCancellationRequested();

            var fullDir = ResolveSafePath(relativePath);

            if (Directory.Exists(fullDir))
            {
                var fullFilePath = Path.Combine(fullDir, fileName);
                if (File.Exists(fullFilePath))
                    File.Delete(fullFilePath); // Overwrite existing file   

                ct.ThrowIfCancellationRequested();

                using var output = File.Create(fullFilePath);
                await fileStream.CopyToAsync(output, ct);
            }
        }


        // ---------------------------------------------------------------------
        // Download
        // ---------------------------------------------------------------------

        public async Task<FileDownloadResult> DownloadFileAsync(string relativeFilePath, CancellationToken ct)
        {
            var fullPath = ResolveSafePath(relativeFilePath);
            var memoryStream = new MemoryStream();

            if (!File.Exists(fullPath))
                throw new FileNotFoundException(fullPath);

            using var stream = File.OpenRead(fullPath);
            await stream.CopyToAsync(memoryStream, ct);
            memoryStream.Position = 0;

            // Detect MIME type
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(fullPath, out var contentType))
            {
                contentType = "application/octet-stream"; // fallback
            }

            return new FileDownloadResult
            {
                Stream = memoryStream,
                FileName = Path.GetFileName(fullPath),
                ContentType = contentType
            };
        }

        // ---------------------------------------------------------------------
        // Move File
        // ---------------------------------------------------------------------

        public Task MoveFileAsync(string sourceRelativePath, string targetRelativePath, CancellationToken ct)
        {
            ct.ThrowIfCancellationRequested();

            var sourceFullPath = ResolveSafePath(sourceRelativePath);
            var targetFullPath = ResolveSafePath(targetRelativePath);

            if (!File.Exists(sourceFullPath))
                throw new FileNotFoundException("Source path not found.", sourceFullPath);

            if (!Directory.Exists(targetFullPath))
                throw new DirectoryNotFoundException("Target path not found.");

            var sourceFile = new FileInfo(sourceFullPath);
            var targetDir = Path.Combine(targetFullPath, sourceFile.Name);

            Directory.Move(sourceFullPath, targetDir);

            return Task.CompletedTask;
        }

        // ---------------------------------------------------------------------
        // Delete File
        // ---------------------------------------------------------------------

        public Task DeleteFileAsync(string relativePath, CancellationToken ct)
        {
            ct.ThrowIfCancellationRequested();

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
    }
}