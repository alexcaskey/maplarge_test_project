namespace TestProject.Models
{
    public class DirectoryBrowseResult
    {
        public string Path { get; set; } = "";
        public List<FileItem> Files { get; set; } = new();
        public List<FolderItem> Folders { get; set; } = new();
        public int TotalFileCount { get; set; }
        public int TotalFolderCount { get; set; }
        public long TotalSize { get; set; }
    }
}