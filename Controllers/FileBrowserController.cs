using Microsoft.AspNetCore.Mvc;
using TestProject.Api.Services;
using TestProject.Models;

namespace TestProject.Controllers
{

    [ApiController]
    [Route("api/fs")]
    public class FileBrowserController : ControllerBase
    {
        private readonly IFileSystemService _fs;

        public FileBrowserController(IFileSystemService fs)
        {
            _fs = fs;
        }

        [HttpGet("{*path}")]
        public async Task<IActionResult> HandlePath([FromRoute] string? path)
        {
            path ??= "";

            // Normalize slashes
            path = path.Replace('/', '\\');

            // Resolve full path
            var fullPath = _fs.ResolveSafePath(path);

            if (Directory.Exists(fullPath))
            {
                // directory so display the contents
                var result = await _fs.BrowseAsync(path);
                return Ok(result);
            } else if (System.IO.File.Exists(fullPath))
            {
                // file so server it up
                var file = await _fs.DownloadFileAsync(path);
                return File(file.Stream, file.ContentType, file.FileName);
            }

            // Otherwise → not found
            return NotFound(new { error = "Path not found." });
        }

        [HttpPost("move")]
        public async Task<IActionResult> Move([FromBody] MoveRequest request)
        {
            await _fs.MoveFileAsync(request.Source ?? "", request.Target ?? "");
            return Ok();
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteRequest req)
        {
            await _fs.DeleteFileAsync(req.Path ?? "");
            return Ok();
        }

        [HttpGet("search")]
        public async Task<SearchResult> Search([FromQuery] string query)
        {
            return await _fs.SearchAsync(query);
        } 

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromQuery] string? path, IFormFile file)
        {
            using var stream = file.OpenReadStream();
            await _fs.UploadFileAsync(path ?? "", stream, file.FileName);
            return Ok();
        }
    }
}