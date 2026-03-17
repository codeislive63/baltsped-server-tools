using Baltsped.Tools.Server.Features.DmReplace.Models;

namespace Baltsped.Tools.Server.Features.DmReplace;

/// <summary>
/// Ищет записи по TE и обновляет DM код для выбранной строки
/// </summary>
public interface IDmReplaceService
{
    Task<IReadOnlyList<DmReplaceRowModel>> SearchAsync(string teCode, CancellationToken cancellationToken);

    Task<DmReplaceUpdateResultModel> UpdateAsync(
        string teCode,
        int itemId,
        string newDm,
        CancellationToken cancellationToken
    );
}
