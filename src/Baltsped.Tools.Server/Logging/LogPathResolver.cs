using System.Security;

namespace Baltsped.Tools.Server.Logging;

/// <summary>
/// Определяет папку для логов рядом с приложением и использует fallback при нехватке прав
/// </summary>
public static class LogPathResolver
{
    public static string GetLogDirectory()
    {
        var baseDirectory = AppContext.BaseDirectory;
        var nearExeDirectory = Path.Combine(baseDirectory, "logs");

        if (TryEnsureDirectory(nearExeDirectory))
        {
            return nearExeDirectory;
        }

        var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var fallbackDirectory = Path.Combine(localAppData, "Baltsped.Tools.Server", "logs");

        Directory.CreateDirectory(fallbackDirectory);
        return fallbackDirectory;
    }

    // Пытается создать папку для логов и возвращает false, если не хватает прав
    private static bool TryEnsureDirectory(string directory)
    {
        try
        {
            Directory.CreateDirectory(directory);
            return true;
        }
        catch (UnauthorizedAccessException)
        {
            return false;
        }
        catch (SecurityException)
        {
            return false;
        }
        catch (IOException)
        {
            return false;
        }
    }
}
