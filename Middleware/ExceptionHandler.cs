namespace TestProject.Api.Middleware
{
    public class ExceptionHandler
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandler> _logger;
        private readonly string _root;

        public ExceptionHandler(RequestDelegate next, ILogger<ExceptionHandler> logger, IConfiguration config)
        {
            _next = next;
            _logger = logger;
            _root = config["RootDirectory"] ?? "";
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var status = ex switch
            {
                UnauthorizedAccessException => StatusCodes.Status403Forbidden,
                FileNotFoundException => StatusCodes.Status404NotFound,
                DirectoryNotFoundException => StatusCodes.Status404NotFound,
                ArgumentException => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };

            var problem = new
            {
                error = ex.Message.Replace(_root, "[root]"),
                type = ex.GetType().Name,
                status
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = status;

            return context.Response.WriteAsJsonAsync(problem);
        }
    }
}
