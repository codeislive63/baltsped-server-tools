import { useState } from 'react';
import { CheckCircle2, Package, RefreshCcw, Search, Trash2 } from 'lucide-react';
import { AppLayout } from '../shared/layout/AppLayout';
import { MOCK_TE_DATA } from '../shared/mock/teData';
import type { TeRecord } from '../shared/types/app';
import { Header } from '../shared/ui/Header';

export function TeLookup() {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<TeRecord[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    function handleSearch(): void {
        const normalizedSearch = search.trim();

        if (normalizedSearch.length === 0) {
            return;
        }

        setIsSearching(true);

        window.setTimeout(() => {
            const foundResults = MOCK_TE_DATA.filter(record => record.teNumber.includes(normalizedSearch));
            setResults(foundResults);
            setIsSearching(false);
            setHasSearched(true);
        }, 800);
    }

    function clear(): void {
        setSearch('');
        setResults([]);
        setHasSearched(false);
    }

    return (
        <AppLayout activePage="te-viewer">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Header
                    title="Просмотр содержимого ТЕ"
                    description="Поиск и анализ содержимого транспортных единиц. Введите номер ТЕ для получения детальной информации о вложенных DM-кодах и SKU."
                />

                <div className="card-brand p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-dim" size={18} />
                            <input
                                type="text"
                                placeholder="Введите номер ТЕ (например, TE-99281)"
                                className="input-field pl-10"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching || search.trim().length === 0}
                                className="btn-primary min-w-[120px]"
                            >
                                {isSearching ? <RefreshCcw size={18} className="animate-spin" /> : 'Найти'}
                            </button>

                            <button
                                type="button"
                                onClick={clear}
                                className="btn-secondary"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {hasSearched && results.length > 0 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="card-brand p-4 bg-brand-surface-light/20">
                                <p className="text-[10px] text-brand-text-dim uppercase font-bold mb-1">Всего записей</p>
                                <p className="text-2xl font-mono font-bold">{results.length}</p>
                            </div>

                            <div className="card-brand p-4 bg-brand-surface-light/20">
                                <p className="text-[10px] text-brand-text-dim uppercase font-bold mb-1">Уникальных SKU</p>
                                <p className="text-2xl font-mono font-bold">
                                    {new Set(results.map(record => record.sku)).size}
                                </p>
                            </div>

                            <div className="card-brand p-4 bg-brand-surface-light/20">
                                <p className="text-[10px] text-brand-text-dim uppercase font-bold mb-1">Общее кол-во</p>
                                <p className="text-2xl font-mono font-bold">
                                    {results.reduce((total, current) => total + current.quantity, 0)}
                                </p>
                            </div>

                            <div className="card-brand p-4 bg-brand-surface-light/20">
                                <p className="text-[10px] text-brand-text-dim uppercase font-bold mb-1">Статус ТЕ</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <CheckCircle2 size={16} className="text-brand-success" />
                                    <span className="text-sm font-bold text-brand-success">Проверено</span>
                                </div>
                            </div>
                        </div>

                        <div className="table-container">
                            <table className="table-brand">
                                <thead>
                                <tr>
                                    <th>ID Записи</th>
                                    <th>DM Код</th>
                                    <th>SKU</th>
                                    <th>Кол-во</th>
                                    <th>Статус</th>
                                    <th>Время</th>
                                </tr>
                                </thead>
                                <tbody>
                                {results.map((row) => (
                                    <tr key={row.id}>
                                        <td className="font-mono text-brand-text-dim">{row.id}</td>
                                        <td className="font-mono font-bold text-brand-accent">{row.dmCode}</td>
                                        <td className="font-mono">{row.sku}</td>
                                        <td className="font-mono">{row.quantity}</td>
                                        <td>
                                            {row.status === 'active' && <span className="badge badge-success">Активен</span>}
                                            {row.status === 'replaced' && <span className="badge badge-warning">Заменен</span>}
                                            {row.status === 'error' && <span className="badge badge-error">Ошибка</span>}
                                        </td>
                                        <td className="text-xs text-brand-text-dim">{row.timestamp}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {hasSearched && results.length === 0 && (
                    <div className="card-brand p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-brand-surface-light rounded-full flex items-center justify-center mb-4 border border-brand-border">
                            <Search size={32} className="text-brand-text-dim" />
                        </div>

                        <h3 className="text-xl font-bold mb-2">Ничего не найдено</h3>

                        <p className="text-brand-text-muted max-w-md">
                            По вашему запросу <span className="text-brand-text font-mono">"{search}"</span> данных не обнаружено.
                            Проверьте правильность ввода номера ТЕ.
                        </p>
                    </div>
                )}

                {!hasSearched && (
                    <div className="card-brand p-12 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-50">
                        <Package size={48} className="text-brand-text-dim mb-4" />
                        <p className="text-brand-text-muted">Ожидание ввода номера транспортной единицы...</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
