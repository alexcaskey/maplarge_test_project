namespace TestProject.Models
{
    public class FileDownloadResult
    {
        public Stream Stream { get; set; } = Stream.Null;
        public string FileName { get; set; } = "";
        public string ContentType { get; set; } = "application/octet-stream";
    }
}
