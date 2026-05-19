namespace TestProject.Models
{
    public class SearchResult
    {
        public string Query { get; set; } = "";
        public List<FileItem> Matches { get; set; } = new();
    }
}