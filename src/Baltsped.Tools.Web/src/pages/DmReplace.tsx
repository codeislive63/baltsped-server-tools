import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    LoaderCircle,
    ScanLine,
    RefreshCcw,
    Search,
    XCircle,
} from 'lucide-react';
import { AppLayout } from '../shared/layout/AppLayout';
import { Header } from '../shared/ui/Header';

type MessageModel = {
    type: 'success' | 'error' | 'warning';
    text: string;
};

type DmReplaceRowModel = {
    itemId: number;
    barcode: string;
    teCode: string;
    batchName: string;
    targetCode: string;
};

type DmReplaceUpdateResultModel = {
    updatedCount: number;
    updatedItems: Array<{
        itemId: number;
        previousDm: string;
        newDm: string;
    }>;
};

type HistoryRow = {
    id: string;
    teCode: string;
    itemId: number;
    oldDm: string;
    newDm: string;
    changedAt: string;
};

const API_ROOT = '/api/dm/replace';

const CYRILLIC_MAP: Record<string, string> = {
    А: 'A',
    В: 'B',
    Е: 'E',
    К: 'K',
    М: 'M',
    Н: 'H',
    О: 'O',
    Р: 'P',
    С: 'C',
    Т: 'T',
    У: 'Y',
    Х: 'X',
    а: 'a',
    в: 'b',
    е: 'e',
    к: 'k',
    м: 'm',
    н: 'h',
    о: 'o',
    р: 'p',
    с: 'c',
    т: 't',
    у: 'y',
    х: 'x',
};

function normalizeTe(value: string): string {
    return value.trim();
}

function normalizeDm(value: string): string {
    return value
        .trim()
        .split('')
        .filter(ch => !/\s/.test(ch))
        .map(ch => CYRILLIC_MAP[ch] ?? ch)
        .join('');
}

async function readErrorMessage(response: Response): Promise<string> {
    try {
        const payload = await response.json() as { detail?: string };
        if (typeof payload.detail === 'string' && payload.detail.trim().length > 0) {
            return payload.detail;
        }
    }
    catch {
        // ignore parse errors
    }

    return 'Не удалось выполнить операцию';
}

export function DmReplace() {
    const teInputRef = useRef<HTMLInputElement | null>(null);
    const oldDmInputRef = useRef<HTMLInputElement | null>(null);
    const newDmInputRef = useRef<HTMLInputElement | null>(null);

    const [teCode, setTeCode] = useState('');
    const [oldDm, setOldDm] = useState('');
    const [newDm, setNewDm] = useState('');
    const [isLoadingRows, setIsLoadingRows] = useState(false);
    const [isReplacing, setIsReplacing] = useState(false);
    const [rows, setRows] = useState<DmReplaceRowModel[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [message, setMessage] = useState<MessageModel | null>(null);
    const [history, setHistory] = useState<HistoryRow[]>([]);

    const selectedRow = useMemo(
        () => rows.find(row => row.itemId === selectedItemId) ?? null,
        [rows, selectedItemId],
    );

    useEffect(() => {
        teInputRef.current?.focus();
    }, []);

    async function handleLoadTe(): Promise<void> {
        const normalizedTeCode = normalizeTe(teCode);

        if (normalizedTeCode.length === 0) {
            setMessage({ type: 'warning', text: 'Сначала отсканируйте или введите ТЕ' });
            return;
        }

        setIsLoadingRows(true);
        setMessage(null);
        setSelectedItemId(null);
        setOldDm('');
        setNewDm('');

        try {
            const response = await fetch(`${API_ROOT}?teCode=${encodeURIComponent(normalizedTeCode)}`);

            if (!response.ok) {
                throw new Error(await readErrorMessage(response));
            }

            const payload = await response.json() as DmReplaceRowModel[];
            setRows(payload);

            if (payload.length === 0) {
                setMessage({
                    type: 'warning',
                    text: `Для ТЕ ${normalizedTeCode} записи не найдены`,
                });
                return;
            }

            setMessage({
                type: 'success',
                text: `ТЕ ${normalizedTeCode}: найдено строк ${payload.length}. Сканируйте старый DM`,
            });

            window.setTimeout(() => oldDmInputRef.current?.focus(), 0);
        }
        catch (error) {
            const details = error instanceof Error ? error.message : 'Ошибка загрузки данных ТЕ';
            setRows([]);
            setMessage({ type: 'error', text: details });
        }
        finally {
            setIsLoadingRows(false);
        }
    }

    function handleOldDmSubmit(): void {
        const normalizedOldDm = normalizeDm(oldDm);

        if (rows.length === 0) {
            setMessage({ type: 'warning', text: 'Сначала загрузите ТЕ' });
            return;
        }

        if (normalizedOldDm.length === 0) {
            setMessage({ type: 'warning', text: 'Сканируйте старый DM код' });
            return;
        }

        const foundRow = rows.find(row => normalizeDm(row.barcode) === normalizedOldDm);

        if (!foundRow) {
            setSelectedItemId(null);
            setMessage({
                type: 'error',
                text: 'Запись со старым DM не найдена в выбранном ТЕ',
            });
            return;
        }

        setSelectedItemId(foundRow.itemId);
        setMessage({
            type: 'success',
            text: `Запись найдена (ItemId ${foundRow.itemId}). Сканируйте новый DM`,
        });
        window.setTimeout(() => newDmInputRef.current?.focus(), 0);
    }

    async function handleReplace(): Promise<void> {
        const normalizedTeCode = normalizeTe(teCode);
        const normalizedOldDm = normalizeDm(oldDm);
        const normalizedNewDm = normalizeDm(newDm);

        if (rows.length === 0) {
            setMessage({ type: 'warning', text: 'Сначала загрузите ТЕ' });
            return;
        }

        if (!selectedRow || normalizeDm(selectedRow.barcode) !== normalizedOldDm) {
            setMessage({ type: 'warning', text: 'Сначала найдите запись по старому DM' });
            window.setTimeout(() => oldDmInputRef.current?.focus(), 0);
            return;
        }

        if (normalizedNewDm.length === 0) {
            setMessage({ type: 'warning', text: 'Сканируйте новый DM код' });
            return;
        }

        if (normalizedNewDm === normalizedOldDm) {
            setMessage({ type: 'warning', text: 'Новый DM совпадает со старым' });
            return;
        }

        if (rows.some(row => row.itemId !== selectedRow.itemId && normalizeDm(row.barcode) === normalizedNewDm)) {
            setMessage({ type: 'error', text: 'Новый DM уже существует' });
            return;
        }

        setIsReplacing(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_ROOT}/${selectedRow.itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teCode: normalizedTeCode,
                    newDm: normalizedNewDm,
                }),
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response));
            }

            const payload = await response.json() as DmReplaceUpdateResultModel;
            const apiNewDm = payload.updatedItems[0]?.newDm ?? normalizedNewDm;
            const apiOldDm = payload.updatedItems[0]?.previousDm ?? selectedRow.barcode;

            setRows(previousRows =>
                previousRows.map(row =>
                    row.itemId === selectedRow.itemId
                        ? {
                            ...row,
                            barcode: apiNewDm,
                        }
                        : row,
                ),
            );

            const historyRow: HistoryRow = {
                id: `${Date.now()}-${selectedRow.itemId}`,
                teCode: normalizedTeCode,
                itemId: selectedRow.itemId,
                oldDm: apiOldDm,
                newDm: apiNewDm,
                changedAt: new Date().toLocaleTimeString('ru-RU'),
            };

            setHistory(previous => [historyRow, ...previous].slice(0, 20));
            setOldDm('');
            setNewDm('');
            setSelectedItemId(null);
            setMessage({ type: 'success', text: 'Замена выполнена. Можно сканировать следующий старый DM' });
            window.setTimeout(() => oldDmInputRef.current?.focus(), 0);
        }
        catch (error) {
            const details = error instanceof Error ? error.message : 'Ошибка при замене DM';
            setMessage({ type: 'error', text: details });
        }
        finally {
            setIsReplacing(false);
        }
    }

    return (
        <AppLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Header
                    title="Замена DM-кодов"
                    description="Scanner-first экран для быстрой замены DM внутри выбранной транспортной единицы."
                />

                <div className="space-y-6">
                    <div className="card-brand p-6 lg:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                                <ScanLine size={20} className="text-brand-primary" />
                                <h3 className="text-lg font-bold">Быстрая замена</h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="lg:col-span-4 space-y-2">
                                    <label className="block text-xs font-bold text-brand-text-dim uppercase tracking-wide">
                                        1) Транспортная единица (ТЕ)
                                    </label>
                                    <input
                                        ref={teInputRef}
                                        type="text"
                                        className="input-field h-12 text-base font-mono"
                                        placeholder="Сканируйте или введите ТЕ"
                                        value={teCode}
                                        onChange={(event) => setTeCode(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                void handleLoadTe();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-primary w-full h-11"
                                        onClick={() => void handleLoadTe()}
                                        disabled={isLoadingRows}
                                    >
                                        {isLoadingRows ? <LoaderCircle size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                                        {isLoadingRows ? 'Загрузка...' : 'Загрузить строки ТЕ'}
                                    </button>
                                </div>

                                <div className="lg:col-span-4 space-y-2">
                                    <label className="block text-xs font-bold text-brand-text-dim uppercase tracking-wide">
                                        2) Старый DM
                                    </label>
                                    <input
                                        ref={oldDmInputRef}
                                        type="text"
                                        className="input-field h-12 text-base font-mono"
                                        placeholder="Сканируйте старый DM"
                                        value={oldDm}
                                        disabled={rows.length === 0}
                                        onChange={(event) => setOldDm(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleOldDmSubmit();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-secondary w-full h-11"
                                        onClick={handleOldDmSubmit}
                                        disabled={rows.length === 0}
                                    >
                                        <Search size={16} />
                                        Найти запись
                                    </button>
                                </div>

                                <div className="lg:col-span-4 space-y-2">
                                    <label className="block text-xs font-bold text-brand-text-dim uppercase tracking-wide">
                                        3) Новый DM
                                    </label>
                                    <input
                                        ref={newDmInputRef}
                                        type="text"
                                        className="input-field h-12 text-base font-mono"
                                        placeholder="Сканируйте новый DM"
                                        value={newDm}
                                        disabled={!selectedRow}
                                        onChange={(event) => setNewDm(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                void handleReplace();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-primary w-full h-11"
                                        onClick={() => void handleReplace()}
                                        disabled={!selectedRow || isReplacing}
                                    >
                                        {isReplacing ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                        {isReplacing ? 'Выполняется...' : 'Выполнить замену'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="card-brand p-3 bg-brand-surface-light/40">
                                    <p className="text-[10px] text-brand-text-dim uppercase font-bold mb-1">Текущий ТЕ</p>
                                    <p className="font-mono text-sm font-bold">{normalizeTe(teCode) || '-'}</p>
                                </div>
                                <div className="card-brand p-3 bg-brand-surface-light/40">
                                    <p className="text-[10px] text-brand-text-dim uppercase font-bold mb-1">Строк в ТЕ</p>
                                    <p className="font-mono text-sm font-bold">{rows.length}</p>
                                </div>
                                <div className="card-brand p-3 bg-brand-surface-light/40">
                                    <p className="text-[10px] text-brand-text-dim uppercase font-bold mb-1">Найденная запись</p>
                                    <p className="font-mono text-sm font-bold">{selectedRow ? `ItemId ${selectedRow.itemId}` : '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`p-4 rounded-brand border flex gap-3 animate-in zoom-in-95 duration-300 ${
                                message.type === 'success'
                                    ? 'bg-brand-success/10 border-brand-success/30 text-brand-success'
                                    : message.type === 'error'
                                        ? 'bg-brand-error/10 border-brand-error/30 text-brand-error'
                                        : 'bg-brand-warning/10 border-brand-warning/30 text-brand-warning'
                            }`}
                        >
                            {message.type === 'success' && <CheckCircle2 size={20} className="shrink-0" />}
                            {message.type === 'error' && <XCircle size={20} className="shrink-0" />}
                            {message.type === 'warning' && <AlertCircle size={20} className="shrink-0" />}
                            <p className="text-sm font-medium">{message.text}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        <div className="xl:col-span-8 space-y-3">
                            <h4 className="text-sm font-bold uppercase tracking-wide text-brand-text-dim">
                                Содержимое ТЕ (fallback)
                            </h4>
                            {rows.length > 0 ? (
                                <div className="table-container">
                                    <table className="table-brand">
                                        <thead>
                                        <tr>
                                            <th>ItemId</th>
                                            <th>DM</th>
                                            <th>Партия</th>
                                            <th>Маршрут</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {rows.map((row) => (
                                            <tr
                                                key={row.itemId}
                                                className={row.itemId === selectedItemId ? 'bg-brand-primary/5' : undefined}
                                            >
                                                <td className="font-mono text-xs">{row.itemId}</td>
                                                <td className="font-mono font-semibold text-xs break-all">{row.barcode}</td>
                                                <td className="text-xs">{row.batchName || '-'}</td>
                                                <td className="font-mono text-xs">{row.targetCode || '-'}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="card-brand p-8 flex flex-col items-center justify-center text-center border-dashed border-2 opacity-60">
                                    <RefreshCcw size={36} className="text-brand-text-dim mb-3" />
                                    <p className="text-brand-text-muted">Загрузите ТЕ, чтобы увидеть строки</p>
                                </div>
                            )}
                        </div>

                        <div className="xl:col-span-4 space-y-3">
                            <h4 className="text-sm font-bold uppercase tracking-wide text-brand-text-dim">
                                Последние замены (сессия)
                            </h4>
                            <div className="card-brand">
                                {history.length > 0 ? (
                                    <div className="max-h-[380px] overflow-auto divide-y divide-brand-border">
                                        {history.map((entry) => (
                                            <div key={entry.id} className="p-3 text-xs">
                                                <div className="flex items-center justify-between gap-2 mb-2">
                                                    <span className="badge badge-success">Успех</span>
                                                    <span className="text-brand-text-dim flex items-center gap-1">
                                                        <Clock3 size={12} />
                                                        {entry.changedAt}
                                                    </span>
                                                </div>
                                                <p className="font-mono">TE: {entry.teCode}</p>
                                                <p className="font-mono">ItemId: {entry.itemId}</p>
                                                <p className="font-mono break-all">Старый: {entry.oldDm}</p>
                                                <p className="font-mono break-all">Новый: {entry.newDm}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-sm text-brand-text-muted">
                                        В этой сессии замен пока нет.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
