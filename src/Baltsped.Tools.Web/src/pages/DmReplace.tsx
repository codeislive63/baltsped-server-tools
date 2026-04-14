import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    LoaderCircle,
    RefreshCcw,
    Search,
    Workflow,
    XCircle,
} from 'lucide-react';
import { AppLayout } from '../shared/layout/AppLayout';
import { Header } from '../shared/ui/Header';

type MessageModel = {
    type: 'success' | 'error' | 'warning';
    text: string;
};

type FlowStatus =
    | 'idle'
    | 'te-loaded'
    | 'row-found'
    | 'row-not-found'
    | 'new-dm-exists'
    | 'same-dm'
    | 'replace-success'
    | 'error';

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

type IntroStage = {
    id: 'te' | 'old' | 'new';
    title: string;
    subtitle: string;
    description: string;
    exampleLabel: string;
    exampleValue: string;
};

const API_ROOT = '/api/dm/replace';

const INTRO_STAGES: IntroStage[] = [
    {
        id: 'te',
        title: 'Сканирование ТЕ',
        subtitle: 'Шаг 1 из 3',
        description: 'Сканируйте TE. После загрузки строк переход к этапу старого DM выполнится автоматически',
        exampleLabel: 'Пример ТЕ',
        exampleValue: '4421682',
    },
    {
        id: 'old',
        title: 'Поиск по старому DM',
        subtitle: 'Шаг 2 из 3',
        description: 'Сканируйте старый DM. Интерфейс автоматически определит нужную запись в рамках выбранного ТЕ',
        exampleLabel: 'Пример старого DM',
        exampleValue: '004804202066008320102p',
    },
    {
        id: 'new',
        title: 'Замена на новый DM',
        subtitle: 'Шаг 3 из 3',
        description: 'Сканируйте новый DM и выполните замену',
        exampleLabel: 'Пример нового DM',
        exampleValue: '004804202066008320102h',
    },
];

// noinspection NonAsciiCharacters
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
    const [flowStatus, setFlowStatus] = useState<FlowStatus>('idle');
    const [activeStage, setActiveStage] = useState(0);

    const selectedRow = useMemo(
        () => rows.find(row => row.itemId === selectedItemId) ?? null,
        [rows, selectedItemId],
    );
    const normalizedTeCode = normalizeTe(teCode);
    const normalizedOldDm = normalizeDm(oldDm);
    const normalizedNewDm = normalizeDm(newDm);
    const maxUnlockedStage = selectedRow ? 2 : rows.length > 0 ? 1 : 0;

    useEffect(() => {
        teInputRef.current?.focus();
    }, []);

    useEffect(() => {
        const timerId = window.setInterval(() => {
            setActiveStage((current) => {
                const next = (current + 1) % INTRO_STAGES.length;
                return next <= maxUnlockedStage ? next : current;
            });
        }, 2600);

        return () => window.clearInterval(timerId);
    }, [maxUnlockedStage]);

    async function handleLoadTe(): Promise<void> {
        if (normalizedTeCode.length === 0) {
            setMessage({ type: 'warning', text: 'Сначала отсканируйте или введите ТЕ' });
            return;
        }

        setIsLoadingRows(true);
        setMessage(null);
        setSelectedItemId(null);
        setOldDm('');
        setNewDm('');
        setFlowStatus('idle');

        try {
            const response = await fetch(`${API_ROOT}?teCode=${encodeURIComponent(normalizedTeCode)}`);

            if (!response.ok) {
                throw new Error(await readErrorMessage(response));
            }

            const payload = await response.json() as DmReplaceRowModel[];
            setRows(payload);

            if (payload.length === 0) {
                setMessage({ type: 'warning', text: `Для ТЕ ${normalizedTeCode} записи не найдены` });
                setFlowStatus('error');
                return;
            }

            setMessage({
                type: 'success',
                text: `ТЕ ${normalizedTeCode}: найдено строк ${payload.length}. Сканируйте старый DM`,
            });
            setFlowStatus('te-loaded');
            setActiveStage(1);
            window.setTimeout(() => oldDmInputRef.current?.focus(), 0);
        }
        catch (error) {
            const details = error instanceof Error ? error.message : 'Ошибка загрузки данных ТЕ';
            setRows([]);
            setMessage({ type: 'error', text: details });
            setFlowStatus('error');
        }
        finally {
            setIsLoadingRows(false);
        }
    }

    function handleOldDmSubmit(): void {
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
            setMessage({ type: 'error', text: 'Запись со старым DM не найдена в выбранном ТЕ' });
            setFlowStatus('row-not-found');
            return;
        }

        setSelectedItemId(foundRow.itemId);
        setMessage({ type: 'success', text: `Запись найдена (ItemId ${foundRow.itemId}). Сканируйте новый DM` });
        setFlowStatus('row-found');
        setActiveStage(2);
        window.setTimeout(() => newDmInputRef.current?.focus(), 0);
    }

    async function handleReplace(): Promise<void> {
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
            setFlowStatus('same-dm');
            return;
        }

        if (rows.some(row => row.itemId !== selectedRow.itemId && normalizeDm(row.barcode) === normalizedNewDm)) {
            setMessage({ type: 'error', text: 'Новый DM уже существует' });
            setFlowStatus('new-dm-exists');
            return;
        }

        setIsReplacing(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_ROOT}/${selectedRow.itemId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                    row.itemId === selectedRow.itemId ? { ...row, barcode: apiNewDm } : row,
                ),
            );

            setOldDm('');
            setNewDm('');
            setSelectedItemId(null);
            setMessage({ type: 'success', text: `Замена выполнена: ${apiOldDm} -> ${apiNewDm}` });
            setFlowStatus('replace-success');
            setActiveStage(1);
            window.setTimeout(() => oldDmInputRef.current?.focus(), 0);
        }
        catch (error) {
            const details = error instanceof Error ? error.message : 'Ошибка при замене DM';
            setMessage({ type: 'error', text: details });
            setFlowStatus('error');
        }
        finally {
            setIsReplacing(false);
        }
    }

    return (
        <AppLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Header
                    title="Замена DM-кодов"
                    description=""
                />

                <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[74vh] animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(15,23,42,0.03),transparent_45%,rgba(37,99,235,0.06))]" />
                    <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight">Операционный сценарий замены</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Левая часть — рабочая зона, справа — этапы с контролем последовательности.
                                </p>
                            </div>
                            <span className="rounded-full border border-border bg-muted/25 px-2.5 py-1 text-[11px] text-muted-foreground">
                                Interactive flow
                            </span>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
                            <div className="rounded-2xl border border-border bg-background/85 p-5 shadow-sm">
                                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                    {INTRO_STAGES[activeStage].subtitle}
                                </p>
                                <h4 className="mt-2 text-3xl font-semibold tracking-tight">{INTRO_STAGES[activeStage].title}</h4>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{INTRO_STAGES[activeStage].description}</p>

                                <div className="mt-4 rounded-xl border border-border bg-card px-3 py-3">
                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                        {INTRO_STAGES[activeStage].exampleLabel}
                                    </p>
                                    <p className="mt-1 break-all font-mono text-sm font-semibold">
                                        {INTRO_STAGES[activeStage].exampleValue}
                                    </p>
                                </div>

                                <div className="mt-5">
                                    {activeStage === 0 && (
                                        <>
                                            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                                Транспортная единица
                                            </label>
                                            <input
                                                ref={teInputRef}
                                                type="text"
                                                className="mt-2 h-14 w-full rounded-xl border border-border bg-background px-4 font-mono text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:opacity-50"
                                                onClick={() => void handleLoadTe()}
                                                disabled={isLoadingRows}
                                            >
                                                {isLoadingRows ? <LoaderCircle size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                                                {isLoadingRows ? 'Загрузка...' : 'Загрузить строки ТЕ'}
                                            </button>
                                        </>
                                    )}

                                    {activeStage === 1 && (
                                        <>
                                            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                                Старый DM
                                            </label>
                                            <input
                                                ref={oldDmInputRef}
                                                type="text"
                                                className="mt-2 h-14 w-full rounded-xl border border-border bg-background px-4 font-mono text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
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
                                                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-all hover:bg-muted/50 disabled:opacity-50"
                                                onClick={handleOldDmSubmit}
                                                disabled={rows.length === 0}
                                            >
                                                <Search size={16} />
                                                Найти запись
                                            </button>
                                        </>
                                    )}

                                    {activeStage === 2 && (
                                        <>
                                            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                                Новый DM
                                            </label>
                                            <input
                                                ref={newDmInputRef}
                                                type="text"
                                                className="mt-2 h-14 w-full rounded-xl border border-border bg-background px-4 font-mono text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
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
                                                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white transition-all hover:bg-blue-500 disabled:opacity-50"
                                                onClick={() => void handleReplace()}
                                                disabled={!selectedRow || isReplacing}
                                            >
                                                {isReplacing ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                                {isReplacing ? 'Выполняется...' : 'Выполнить замену'}
                                            </button>
                                        </>
                                    )}
                                </div>

                                {message && (
                                    <div
                                        className={`mt-4 rounded-xl border p-3 text-sm flex items-start gap-2 ${
                                            message.type === 'success'
                                                ? 'bg-brand-success/10 border-brand-success/30 text-brand-success'
                                                : message.type === 'error'
                                                    ? 'bg-brand-error/10 border-brand-error/30 text-brand-error'
                                                    : 'bg-brand-warning/10 border-brand-warning/30 text-brand-warning'
                                        }`}
                                    >
                                        {message.type === 'success' && <CheckCircle2 size={18} className="shrink-0 mt-0.5" />}
                                        {message.type === 'error' && <XCircle size={18} className="shrink-0 mt-0.5" />}
                                        {message.type === 'warning' && <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                                        <span>{message.text}</span>
                                    </div>
                                )}
                            </div>

                            <aside className="space-y-3 lg:pl-1">
                                {INTRO_STAGES.map((stage, index) => (
                                    <button
                                        key={stage.id}
                                        type="button"
                                        onClick={() => {
                                            if (index <= maxUnlockedStage) {
                                                setActiveStage(index);
                                            }
                                        }}
                                        disabled={index > maxUnlockedStage}
                                        className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                                            activeStage === index
                                                ? 'border-blue-200 bg-blue-50/70 shadow-sm'
                                                : index > maxUnlockedStage
                                                    ? 'border-border bg-background/60 opacity-55 cursor-not-allowed'
                                                    : 'border-border bg-background hover:border-slate-300 hover:bg-muted/35'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Этап {index + 1}</p>
                                                <p className="mt-1 text-sm font-semibold">{stage.title}</p>
                                            </div>
                                            <span className={`inline-flex size-7 items-center justify-center rounded-lg border text-xs font-semibold ${
                                                activeStage === index
                                                    ? 'border-blue-200 bg-white text-blue-700'
                                                    : 'border-border bg-white text-muted-foreground'
                                            }`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                    </button>
                                ))}

                                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                                    <div className="flex items-center gap-2">
                                        <Workflow size={16} className="text-brand-primary" />
                                        <p className="text-sm font-medium">Статус</p>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Состояние: {flowStatus}
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Доступные этапы: {maxUnlockedStage + 1} из {INTRO_STAGES.length}
                                    </p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {isLoadingRows
                                            ? 'Ожидайте загрузку строк ТЕ'
                                            : !rows.length
                                                ? 'Сканируйте ТЕ'
                                                : !selectedRow
                                                    ? 'Сканируйте старый DM'
                                                    : 'Сканируйте новый DM'}
                                    </p>
                                </div>
                            </aside>
                        </div>

                        <div className="space-y-2">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a,#2563eb)] transition-all duration-500"
                                    style={{ width: `${((activeStage + 1) / INTRO_STAGES.length) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Переход вперед доступен только после завершения предыдущего этапа. Возврат назад разрешен всегда.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
