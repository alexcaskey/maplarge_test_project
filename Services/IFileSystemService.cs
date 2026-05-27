using TestProject.Models;

namespace TestProject.Api.Services
{

    public interface IFileSystemService
    {
        /// <summary>
        /// Returns folder contents (files + subfolders) and metadata such as
        /// total counts and total size.
        /// </summary>
        /// <param name="relativePath">Path relative to the root directory</param>
        /// <param name="ct">Cancellation token</param>
        /// <returns></returns>
        Task<DirectoryBrowseResult> BrowseAsync(string relativePath, CancellationToken ct);

        /// <summary>
        /// Moves a file from source to target path. Both paths are relative to the root
        /// </summary>
        /// <param name="sourceRelativePath"></param>
        /// <param name="targetRelativePath"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task MoveFileAsync(string sourceRelativePath, string targetRelativePath, CancellationToken ct);

        /// <summary>
        /// Deletes the specified file. Path is relative to the root directory.
        /// </summary>
        /// <param name="relativePath"></param>
        /// <param name="ct"></param>
        /// <returns></returns>
        Task DeleteFileAsync(string relativePath, CancellationToken ct);

        /// <summary>
        /// Recursively searches the root directory for files or folders
        /// matching the query text.
        /// </summary>
        /// <param name="query">Search query text</param>
        /// <param name="ct">Cancellation token</param>
        /// <returns></returns>
        Task<SearchResult> SearchAsync(string query, CancellationToken ct);


        /// <summary>
        /// Saves an uploaded file into the specified directory.
        /// </summary>
        /// <param name="relativePath">Target directory path relative to the root</param>
        /// <param name="fileStream">File content stream</param>
        /// <param name="fileName">Original file name (used for saving the file with the same name)</param>
        /// <param name="ct">Cancellation token</param>
        /// <returns></returns>
        Task UploadFileAsync(string relativePath, Stream fileStream, string fileName, CancellationToken ct);


        /// <summary>
        /// Opens a file stream for downloading.
        /// </summary>
        /// <param name="relativeFilePath">Path to the file to download, relative to the root directory</param>
        /// <param name="ct">Cancellation token</param>
        /// <returns></returns>
        Task<FileDownloadResult> DownloadFileAsync(string relativeFilePath, CancellationToken ct);


        /// <summary>
        /// Ensures the requested path stays inside the configured root directory.
        /// Throws if invalid.
        /// </summary>
        /// <param name="relativePath">Path relative to the root directory</param>
        /// <returns>Resolved absolute path that can be safely accessed</returns>
        string ResolveSafePath(string relativePath);
    }
}