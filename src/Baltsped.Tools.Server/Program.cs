using Baltsped.Tools.Server.Database.Extensions;
using Baltsped.Tools.Server.Features.DmReplace;
using Baltsped.Tools.Server.Logging;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

var logDirectory = LogPathResolver.GetLogDirectory();
var logFilePath = Path.Combine(logDirectory, "baltsped-tools-.log");

builder.Host.UseSerilog((context, services, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration)
                 .ReadFrom.Services(services)
                 .Enrich.FromLogContext()
                 .WriteTo.Console()
                 .WriteTo.File(
                     path: logFilePath,
                     rollingInterval: RollingInterval.Day,
                     retainedFileCountLimit: 14,
                     shared: true
                 )
);

builder.Services.AddRazorPages();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddScoped<IDmReplaceService, DmReplaceService>();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

var app = builder.Build();

app.UseForwardedHeaders();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

if (IsHttpsConfigured(builder.Configuration))
{
    app.UseHttpsRedirection();
}
else
{
    app.Logger.LogWarning("HTTPS redirection is disabled because HTTPS endpoint is not configured");
}

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapGet("/", () => Results.Redirect("/dm/replace"));
app.MapRazorPages();

app.Run();

// Проверяет, настроен ли HTTPS endpoint для безопасного редиректа
static bool IsHttpsConfigured(IConfiguration configuration)
{
    var explicitHttpsConfig = configuration["HTTPS_PORT"]
                              ?? configuration["ASPNETCORE_HTTPS_PORT"]
                              ?? configuration["Kestrel:Endpoints:Https:Url"];

    if (!string.IsNullOrWhiteSpace(explicitHttpsConfig))
    {
        return true;
    }

    var rawUrls = configuration["ASPNETCORE_URLS"] ?? configuration["urls"];

    if (string.IsNullOrWhiteSpace(rawUrls))
    {
        return false;
    }

    var urls = rawUrls.Split(';', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

    return urls.Any(url =>
        Uri.TryCreate(url, UriKind.Absolute, out var uri)
        && uri.Scheme.Equals(Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase)
    );
}