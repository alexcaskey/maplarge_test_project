using TestProject.Models;

namespace TestProject.Api.Services
{

    public interface IFileSystemService
    {
        // Browsing --------------------------------------------------------------

        /// <summary>
        /// Returns folder contents (files + subfolders) and metadata such as
        /// total counts and total size.
        /// </summary>
        Task<DirectoryBrowseResult> BrowseAsync(string relativePath);

        Task MoveFileAsync(string sourceRelativePath, string targetRelativePath);

        Task DeleteFileAsync(string relativePath);

        // Searching -------------------------------------------------------------

        /// <summary>
        /// Recursively searches the root directory for files or folders
        /// matching the query text.
        /// </summary>
        Task<SearchResult> SearchAsync(string query);


        // Upload ---------------------------------------------------------------

        /// <summary>
        /// Saves an uploaded file into the specified directory.
        /// </summary>
        Task UploadFileAsync(string relativePath, Stream fileStream, string fileName);


        // Download -------------------------------------------------------------

        /// <summary>
        /// Opens a file stream for downloading.
        /// </summary>
        Task<FileDownloadResult> DownloadFileAsync(string relativeFilePath);


        // Metadata -------------------------------------------------------------

        /// <summary>
        /// Calculates the total size of a directory (recursive).
        /// </summary>
        Task<long> CalculateDirectorySizeAsync(string relativePath);

        /// <summary>
        /// Counts files and folders inside a directory (recursive).
        /// </summary>
        Task<(int fileCount, int folderCount)> CountItemsAsync(string relativePath);


        // Validation / Safety --------------------------------------------------

        /// <summary>
        /// Ensures the requested path stays inside the configured root directory.
        /// Throws if invalid.
        /// </summary>
        string ResolveSafePath(string relativePath);
    }
}