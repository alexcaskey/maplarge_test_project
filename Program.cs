using Microsoft.AspNetCore.Authentication.Cookies;
using TestProject.Api.Extensions;
using TestProject.Api.Middleware;
using TestProject.Api.Services;

namespace TestProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddSingleton<IFileSystemService, FileSystemService>();

            builder.Services.AddAuthentication("Cookies")
                .AddCookie("Cookies", options =>
                {
                    options.Events = new CookieAuthenticationEvents
                    {
                        OnRedirectToLogin = ctx =>
                        {
                            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            return Task.CompletedTask;
                        },
                        OnRedirectToAccessDenied = ctx =>
                        {
                            ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                            return Task.CompletedTask;
                        }
                    };
                });

            builder.Services.AddAuthorization();
            builder.Services.AddControllers();

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseCustomAuthorization();
            app.UseAuthorization();

            app.UseMiddleware<ExceptionHandler>();
            app.UseMiddleware<RouteNotFoundHandler>();

            app.UseStaticFiles();
            app.MapControllers();
            app.Run();
        }
    }
}