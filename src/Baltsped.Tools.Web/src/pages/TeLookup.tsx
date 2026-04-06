import { useState } from 'react';
import { getJson } from '../shared/api/http';

type TeLookupRowModel = {
    teCode: string;
    articleCode: string;
    articleName: string;
    barcode: string;
    batchCode: string;
};

export function TeLookup() {
    const [teCode, setTeCode] = useState('');
    const [rows, setRows] = useState<TeLookupRowModel[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const uniqueArticlesCount = new Set(
        rows
            .map(row => row.articleCode)
            .filter(value => value.trim().length > 0),
    ).size;

    async function handleSearchAsync(): Promise<void> {
        const normalizedTeCode = teCode.trim();

        if (normalizedTeCode.length === 0) {
            setRows([]);
            setSearchPerformed(true);
            setError('Введите TE');
            return;
        }

        setTeCode(normalizedTeCode);
        setIsLoading(true);
        setSearchPerformed(true);
        setError('');

        try {
            const loadedRows = await getJson<TeLookupRowModel[]>(
                `/api/te/lookup?teCode=${encodeURIComponent(normalizedTeCode)}`,
            );

            setRows(loadedRows);
        }
        catch (exception) {
            setRows([]);
            setError(exception instanceof Error ? exception.message : 'Не удалось загрузить данные');
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleClear(): void {
        setTeCode('');
        setRows([]);
        setError('');
        setSearchPerformed(false);
    }

    return (
        <main className="app-shell">
            <a href="/" className="back-link">← Назад к каталогу</a>

            <header className="page-header">
                <h1 className="page-title">Просмотр содержимого ТЕ</h1>
                <p className="page-description">
                    Поиск и анализ содержимого транспортных единиц по номеру ТЕ
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
                        <button type="submit" className="button-primary" disabled={isLoading}>
                            {isLoading ? 'Загрузка...' : 'Найти'}
                        </button>
                        <button type="button" className="button-secondary" onClick={handleClear}>
                            Очистить
                        </button>
                    </div>
                </form>
            </section>

            {error.length > 0 && (
                <section className="alert alert-error">
                    {error}
                </section>
            )}

            {rows.length > 0 && (
                <>
                    <section className="stats-grid">
                        <article className="stat-card">
                            <span className="stat-label">Всего записей</span>
                            <strong className="stat-value">{rows.length}</strong>
                        </article>

                        <article className="stat-card">
                            <span className="stat-label">Уникальных SKU</span>
                            <strong className="stat-value">{uniqueArticlesCount}</strong>
                        </article>

                        <article className="stat-card">
                            <span className="stat-label">Общее кол-во</span>
                            <strong className="stat-value">{rows.length}</strong>
                        </article>

                        <article className="stat-card">
                            <span className="stat-label">Статус ТЕ</span>
                            <strong className="stat-value stat-value-success">Проверено</strong>
                        </article>
                    </section>

                    <section className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>ТЕ</th>
                                    <th>Артикул</th>
                                    <th>Наименование</th>
                                    <th>Штрихкод</th>
                                    <th>Код партии</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={`${row.barcode}-${index}`}>
                                        <td>{index + 1}</td>
                                        <td className="mono-cell">{row.teCode}</td>
                                        <td className="mono-cell">{row.articleCode}</td>
                                        <td>{row.articleName}</td>
                                        <td className="mono-cell">{row.barcode}</td>
                                        <td className="mono-cell">{row.batchCode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </>
            )}

            {searchPerformed && rows.length === 0 && error.length === 0 && !isLoading && (
                <section className="empty-state">
                    По вашему запросу ничего не найдено. Проверьте правильность номера ТЕ
                </section>
            )}

            {!searchPerformed && (
                <section className="empty-state">
                    Ожидание ввода номера транспортной единицы...
                </section>
            )}
        </main>
    );
}
