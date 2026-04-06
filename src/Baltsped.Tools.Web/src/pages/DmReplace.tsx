import { useState } from 'react';
import { getJson, postJson } from '../shared/api/http';

type DmReplaceRowModel = {
    itemId: number;
    barcode: string;
    teCode: string;
    batchName: string;
    targetCode: string;
};

type DmChangedItemModel = {
    itemId: number;
    previousDm: string;
    newDm: string;
};

type DmReplaceUpdateResultModel = {
    updatedCount: number;
    updatedItems: DmChangedItemModel[];
};

type DmReplaceUpdateRequestModel = {
    teCode: string;
    newDm: string;
};

export function DmReplace() {
    const [teCode, setTeCode] = useState('');
    const [rows, setRows] = useState<DmReplaceRowModel[]>([]);
    const [newDmValues, setNewDmValues] = useState<Record<number, string>>({});
    const [error, setError] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
    const [updateSummary, setUpdateSummary] = useState<DmReplaceUpdateResultModel | null>(null);

    async function handleSearchAsync(): Promise<void> {
        const normalizedTeCode = teCode.trim();

        if (normalizedTeCode.length === 0) {
            setRows([]);
            setSearchPerformed(true);
            setUpdateSummary(null);
            setError('Введите TE');
            return;
        }

        setTeCode(normalizedTeCode);
        setIsSearching(true);
        setSearchPerformed(true);
        setUpdateSummary(null);
        setError('');

        try {
            await loadRowsAsync(normalizedTeCode);
        }
        catch (exception) {
            setRows([]);
            setError(exception instanceof Error ? exception.message : 'Не удалось загрузить данные');
        }
        finally {
            setIsSearching(false);
        }
    }

    function handleNewDmChange(itemId: number, value: string): void {
        setNewDmValues(currentValues => ({
            ...currentValues,
            [itemId]: value,
        }));
    }

    async function handleUpdateAsync(itemId: number): Promise<void> {
        const normalizedTeCode = teCode.trim();
        const normalizedNewDm = (newDmValues[itemId] ?? '').replace(/\s+/g, '').trim();

        if (normalizedTeCode.length === 0) {
            setError('Введите TE');
            return;
        }

        if (normalizedNewDm.length === 0) {
            setError('Введите новый DM');
            return;
        }

        setUpdatingItemId(itemId);
        setUpdateSummary(null);
        setError('');

        try {
            const result = await postJson<DmReplaceUpdateResultModel, DmReplaceUpdateRequestModel>(
                `/api/dm/replace/${itemId}`,
                {
                    teCode: normalizedTeCode,
                    newDm: normalizedNewDm,
                }
            );

            setUpdateSummary(result);

            setNewDmValues(currentValues => ({
                ...currentValues,
                [itemId]: '',
            }));

            await loadRowsAsync(normalizedTeCode);
        }
        catch (exception) {
            setError(exception instanceof Error ? exception.message : 'Не удалось обновить DM код');
        }
        finally {
            setUpdatingItemId(null);
        }
    }

    async function loadRowsAsync(currentTeCode: string): Promise<void> {
        const loadedRows = await getJson<DmReplaceRowModel[]>(
            `/api/dm/replace?teCode=${encodeURIComponent(currentTeCode)}`,
        );

        setRows(loadedRows);
        setNewDmValues(currentValues => {
            const nextValues: Record<number, string> = {};

            for (const row of loadedRows) {
                nextValues[row.itemId] = currentValues[row.itemId] ?? '';
            }

            return nextValues;
        });
    }

    return (
        <main className="app-shell">
            <a href="/" className="back-link">← Назад к каталогу</a>

            <header className="page-header">
                <h1 className="page-title">Замена DM-кодов</h1>
                <p className="page-description">
                    Поиск записей по номеру ТЕ и обновление DM-кода для выбранной строки
                </p>
            </header>

            <section className="form-card">
                <form
                    className="search-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleSearchAsync();
                    }}
                >
                    <input
                        type="text"
                        value={teCode}
                        onChange={(event) => setTeCode(event.target.value)}
                        className="input-field"
                        placeholder="Введите номер ТЕ"
                    />
                    <div className="button-group">
                        <button type="submit" className="button-primary" disabled={isSearching}>
                            {isSearching ? 'Загрузка...' : 'Загрузить данные'}
                        </button>
                    </div>
                </form>
            </section>

            {error.length > 0 && (
                <section className="alert alert-error">
                    {error}
                </section>
            )}

            {updateSummary !== null && updateSummary.updatedCount > 0 && (
                <section className="alert alert-success">
                    <div className="alert-title">DM-код успешно обновлён</div>
                    {updateSummary.updatedItems.map(item => (
                        <div key={item.itemId} className="alert-line mono-cell">
                            #{item.itemId}: {item.previousDm} → {item.newDm}
                        </div>
                    ))}
                </section>
            )}

            {updateSummary !== null && updateSummary.updatedCount === 0 && (
                <section className="alert alert-warning">
                    Изменений не внесено
                </section>
            )}

            {rows.length > 0 && (
                <section className="table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>DM код</th>
                                <th>Партия</th>
                                <th>Target</th>
                                <th>Новый DM</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.itemId}>
                                    <td className="mono-cell">{row.barcode}</td>
                                    <td>{row.batchName || '—'}</td>
                                    <td className="mono-cell">{row.targetCode || '—'}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={newDmValues[row.itemId] ?? ''}
                                            onChange={(event) => handleNewDmChange(row.itemId, event.target.value)}
                                            className="input-field input-field-compact"
                                            placeholder="Новый DM"
                                            disabled={updatingItemId !== null}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="button-secondary"
                                            disabled={updatingItemId !== null}
                                            onClick={() => void handleUpdateAsync(row.itemId)}
                                        >
                                            {updatingItemId === row.itemId ? 'Сохранение...' : 'Заменить'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {searchPerformed && rows.length === 0 && error.length === 0 && !isSearching && (
                <section className="empty-state">
                    По заданному TE записи не найдены
                </section>
            )}

            {!searchPerformed && (
                <section className="empty-state">
                    Загрузите данные ТЕ для начала работы
                </section>
            )}
        </main>
    );
}
