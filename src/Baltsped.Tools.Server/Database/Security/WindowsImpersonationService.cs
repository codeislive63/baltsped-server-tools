using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Security.Principal;
using Baltsped.Tools.Server.Database.Access;
using Microsoft.Extensions.Options;
using Microsoft.Win32.SafeHandles;

namespace Baltsped.Tools.Server.Database.Security;

// Выполняет операции под доменной учетной записью, указанной в настройках приложения
public sealed partial class WindowsImpersonationService(
    IOptions<DatabaseOptions> options,
    ILogger<WindowsImpersonationService> logger) : IWindowsImpersonationService
{
    private const int Logon32LogonNewCredentials = 9;
    private const int Logon32ProviderDefault = 3;

    private readonly DatabaseOptions _options = options.Value;

    public T Run<T>(Func<T> action)
    {
        if (!OperatingSystem.IsWindows())
        {
            throw new InvalidOperationException("Windows impersonation is supported only on Windows");
        }

        var credentials = _options.WindowsImpersonation;

        if (!LogonUser(
                credentials.User,
                credentials.Domain,
                credentials.Password,
                Logon32LogonNewCredentials,
                Logon32ProviderDefault,
                out var tokenHandle))
        {
            var win32Error = Marshal.GetLastPInvokeError();
            
            throw new InvalidOperationException(
                $"Windows impersonation failed for '{credentials.Domain}\\{credentials.User}'",
                new Win32Exception(win32Error)
            );
        }

        using (tokenHandle)
        {
            if (logger.IsEnabled(LogLevel.Debug))
            {
                logger.LogDebug(
                    "Running SQL operation under Windows identity {Domain}",
                    credentials.Domain
                );
            }

            return WindowsIdentity.RunImpersonated(tokenHandle, action);
        }
    }

    public Task<T> RunAsync<T>(Func<Task<T>> action)
    {
        return Run(action);
    }

    public Task RunAsync(Func<Task> action)
    {
        return Run(action);
    }

    [LibraryImport(
        "advapi32.dll",
        EntryPoint = "LogonUserW",
        SetLastError = true,
        StringMarshalling = StringMarshalling.Utf16)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static partial bool LogonUser(
        string username,
        string? domain,
        string password,
        int logonType,
        int logonProvider,
        out SafeAccessTokenHandle tokenHandle
    );
}
