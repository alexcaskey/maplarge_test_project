namespace TestProject.Api.Middleware
{
    public class RouteNotFoundHandler
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RouteNotFoundHandler> _logger;

        public RouteNotFoundHandler(RequestDelegate next, ILogger<RouteNotFoundHandler> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await _next(context);

            // If no endpoint matched AND response is 404 AND nothing has been written yet
            if (context.Response.StatusCode == StatusCodes.Status404NotFound &&
                !context.Response.HasStarted)
            {
                _logger.LogWarning("Route not found: {Path}", context.Request.Path);

                context.Response.ContentType = "application/json";

                var payload = new
                {
                    error = "Route not found.",
                    path = context.Request.Path.Value
                };

                await context.Response.WriteAsJsonAsync(payload);
            }
        }
    }
}
