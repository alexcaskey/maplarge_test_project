using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestProject.Api.Services;
using TestProject.Models;

namespace TestProject.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/fs")]
    public class FileBrowserController : ControllerBase
    {
        private readonly IFileSystemService _fs;

        public FileBrowserController(IFileSystemService fs)
        {
            _fs = fs;
        }

        [HttpGet("folders/{**path}")]
        public async Task<ActionResult<DirectoryBrowseResult>> HandleFolderPath([FromRoute] string? path, CancellationToken ct)
        {
            var result = await _fs.BrowseAsync(path ?? "", ct);
            return result is null ? NotFound() : Ok(result);
        }

        [HttpGet("files/{**path}")]
        public async Task<ActionResult<FileDownloadResult>> HandleFileDownload([FromRoute] string path, CancellationToken ct)
        {  
            var file = await _fs.DownloadFileAsync(path, ct);
            return file is null ? NotFound() : File(file.Stream, file.ContentType, file.FileName); 
        }

        [HttpPost("files/{**path}")]
        public async Task<IActionResult> Upload([FromRoute] string? path, IFormFile file, CancellationToken ct)
        {
            var newPath = path ?? "";
            if (file == null || file.Length == 0)
                return BadRequest("File is empty.");

            using var stream = file.OpenReadStream();
            await _fs.UploadFileAsync(newPath, stream, file.FileName, ct);
            var locationPath  = $"{newPath.TrimEnd('/')}/{file.FileName}";
            return CreatedAtAction(nameof(HandleFileDownload), new { path = locationPath }, null);
        }

        [HttpPatch("files/{**path}")]
        public async Task<IActionResult> Move([FromRoute] string path, [FromBody] MoveRequest request, CancellationToken ct)
        {
            await _fs.MoveFileAsync(path, request.Target, ct);
            return Ok();
        }

        [HttpDelete("files/{**path}")]
        public async Task<IActionResult> Delete([FromRoute] string path, CancellationToken ct)
        {
            await _fs.DeleteFileAsync(path, ct);
            return Ok();
        }

        [HttpGet("search")]
        public async Task<ActionResult<SearchResult>> Search([FromQuery] string query, CancellationToken ct)
        {
            var result = await _fs.SearchAsync(query, ct);
            return Ok(result);
        }
    }
}