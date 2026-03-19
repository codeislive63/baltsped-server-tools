using Baltsped.Tools.Server.Database.Oracle.Extensions;
using Baltsped.Tools.Server.Database.SqlServer.Extensions;
using Baltsped.Tools.Server.Features.DmReplace;
using Baltsped.Tools.Server.Logging;
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

builder.Services.AddSqlServerDatabase(builder.Configuration);
builder.Services.AddOracleDatabase();

builder.Services.AddScoped<IDmReplaceService, DmReplaceService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapRazorPages();

app.Run();
