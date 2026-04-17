import { useEffect, useMemo, useRef, useState } from 'react';
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
    id: 'te' | 'old' | 'replace';
    title: string;
    subtitle: string;
    description: string;
};

type PendingReplaceModel = {
    itemId: number;
    teCode: string;
    oldDm: string;
    newDm: string;
};

type HistoryItem = {
    id: string;
    teCode: string;
    oldDm: string;
    newDm: string;
    createdAt: string;
    status: 'success';
};

type StageVisualState = 'active' | 'done' | 'available' | 'locked';

const API_ROOT = '/api/dm/replace';

const INTRO_STAGES: IntroStage[] = [
    {
        id: 'te',
        title: 'Сканирование ТЕ',
        subtitle: 'Шаг 1 из 3',
        description: 'Сканируйте ТЕ. Переход к следующему этапу выполнится автоматически',
    },
    {
        id: 'old',
        title: 'Поиск по старому DM',
        subtitle: 'Шаг 2 из 3',
        description: 'Сканируйте старый DM. Нужная запись определится автоматически',
    },
    {
        id: 'replace',
        title: 'Замена DM-кода',
        subtitle: 'Шаг 3 из 3',
        description: 'Сканируйте новый DM, проверьте данные и выполните замену',
    },
];

const MOCK_HISTORY: HistoryItem[] = [
    { id: 'h1', teCode: '4421682', oldDm: '004804202066008320102p', newDm: '004804202066008320102h', createdAt: '12:41', status: 'success' },
    { id: 'h2', teCode: '4421658', oldDm: '004804132140008320100f', newDm: '004804132140008320100K', createdAt: '12:37', status: 'success' },
    { id: 'h3', teCode: '4419031', oldDm: '004804112233008320145a', newDm: '004804112233008320145b', createdAt: '12:29', status: 'success' },
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

function getMessageClasses(type: MessageModel['type']): string {
    switch (type) {
        case 'success':
            return 'border-brand-success/25 bg-brand-success/8 text-brand-success';
        case 'error':
            return 'border-brand-error/25 bg-brand-error/8 text-brand-error';
        default:
            return 'border-brand-warning/25 bg-brand-warning/8 text-brand-warning';
    }
}

function getStageVisualState(index: number, activeStage: number, maxUnlockedStage: number): StageVisualState {
    if (index === activeStage) {
        return 'active';
    }

    if (index < activeStage) {
        return 'done';
    }

    if (index <= maxUnlockedStage) {
        return 'available';
    }

    return 'locked';
}

function getStageStatusLabel(state: StageVisualState): string {
    switch (state) {
        case 'active':
            return 'Текущий';
        case 'done':
            return 'Пройден';
        case 'available':
            return 'Доступен';
        default:
            return 'Ожидает';
    }
}

function getSummaryCardClasses(kind: 'neutral' | 'old' | 'new', hasValue: boolean): string {
    if (!hasValue) {
        return 'border-border bg-background/80';
    }

    if (kind === 'old') {
        return 'border-red-200 bg-red-50/70';
    }

    if (kind === 'new') {
        return 'border-emerald-200 bg-emerald-50/70';
    }

    return 'border-slate-200 bg-slate-50/70';
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
    const [, setFlowStatus] = useState<FlowStatus>('idle');
    const [activeStage, setActiveStage] = useState(0);
    const [pendingReplace, setPendingReplace] = useState<PendingReplaceModel | null>(null);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);

    const selectedRow = useMemo(
        () => rows.find(row => row.itemId === selectedItemId) ?? null,
        [rows, selectedItemId],
    );

    const normalizedTeCode = normalizeTe(teCode);
    const normalizedOldDm = normalizeDm(oldDm);
    const normalizedNewDm = normalizeDm(newDm);
    const currentStage = INTRO_STAGES[activeStage];
    const maxUnlockedStage = selectedRow ? 2 : rows.length > 0 ? 1 : 0;
    const progressPercent = ((activeStage + 1) / INTRO_STAGES.length) * 100;

    useEffect(() => {
        if (activeStage > maxUnlockedStage) {
            setActiveStage(maxUnlockedStage);
        }
    }, [activeStage, maxUnlockedStage]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (activeStage === 0) {
                teInputRef.current?.focus();
                teInputRef.current?.select();
                return;
            }

            if (activeStage === 1 && rows.length > 0) {
                oldDmInputRef.current?.focus();
                oldDmInputRef.current?.select();
                return;
            }

            if (activeStage === 2 && selectedRow) {
                newDmInputRef.current?.focus();
                newDmInputRef.current?.select();
            }
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [activeStage, rows.length, selectedRow]);

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
        setPendingReplace(null);
        setFlowStatus('idle');
        setActiveStage(0);

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
        }
        catch (error) {
            const details = error instanceof Error ? error.message : 'Ошибка загрузки данных ТЕ';
            setRows([]);
            setMessage({ type: 'error', text: details });
            setFlowStatus('error');
            setActiveStage(0);
        }
        finally {
            setIsLoadingRows(false);
        }
    }

    function handleOldDmSubmit(): void {
        if (rows.length === 0) {
            setMessage({ type: 'warning', text: 'Сначала загрузите ТЕ' });
            setActiveStage(0);
            return;
        }

        if (normalizedOldDm.length === 0) {
            setMessage({ type: 'warning', text: 'Сканируйте старый DM код' });
            return;
        }

        const foundRow = rows.find(row => normalizeDm(row.barcode) === normalizedOldDm);

        if (!foundRow) {
            setSelectedItemId(null);
            setPendingReplace(null);
            setNewDm('');
            setMessage({ type: 'error', text: 'Запись со старым DM не найдена в выбранном ТЕ' });
            setFlowStatus('row-not-found');
            setActiveStage(1);
            return;
        }

        setSelectedItemId(foundRow.itemId);
        setPendingReplace(null);
        setNewDm('');
        setMessage({ type: 'success', text: `Запись найдена (ItemId ${foundRow.itemId}). Сканируйте новый DM` });
        setFlowStatus('row-found');
        setActiveStage(2);
    }

    function handlePrepareReplace(): void {
        if (rows.length === 0) {
            setMessage({ type: 'warning', text: 'Сначала загрузите ТЕ' });
            setActiveStage(0);
            return;
        }

        if (!selectedRow || normalizeDm(selectedRow.barcode) !== normalizedOldDm) {
            setMessage({ type: 'warning', text: 'Сначала найдите запись по старому DM' });
            setActiveStage(1);
            return;
        }

        if (normalizedNewDm.length === 0) {
            setMessage({ type: 'warning', text: 'Сканируйте новый DM код' });
            setActiveStage(2);
            return;
        }

        if (normalizedNewDm === normalizedOldDm) {
            setMessage({ type: 'warning', text: 'Новый DM совпадает со старым' });
            setFlowStatus('same-dm');
            setActiveStage(2);
            return;
        }

        if (rows.some(row => row.itemId !== selectedRow.itemId && normalizeDm(row.barcode) === normalizedNewDm)) {
            setMessage({ type: 'error', text: 'Новый DM уже существует' });
            setFlowStatus('new-dm-exists');
            setActiveStage(2);
            return;
        }

        setPendingReplace({
            itemId: selectedRow.itemId,
            teCode: normalizedTeCode,
            oldDm: normalizedOldDm,
            newDm: normalizedNewDm,
        });
        setMessage({ type: 'success', text: 'Новый DM проверен. Можно выполнять замену' });
        setActiveStage(2);
    }

    async function handleConfirmReplace(): Promise<void> {
        if (!pendingReplace) {
            setMessage({ type: 'warning', text: 'Сначала проверьте новый DM' });
            setActiveStage(2);
            return;
        }

        setIsReplacing(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_ROOT}/${pendingReplace.itemId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teCode: pendingReplace.teCode,
                    newDm: pendingReplace.newDm,
                }),
            });

            if (!response.ok) {
                throw new Error(await readErrorMessage(response));
            }

            const payload = await response.json() as DmReplaceUpdateResultModel;
            const apiNewDm = payload.updatedItems[0]?.newDm ?? pendingReplace.newDm;
            const apiOldDm = payload.updatedItems[0]?.previousDm ?? pendingReplace.oldDm;

            setRows(previousRows =>
                previousRows.map(row =>
                    row.itemId === pendingReplace.itemId ? { ...row, barcode: apiNewDm } : row,
                ),
            );

            setHistory(previous => [
                {
                    id: `${Date.now()}`,
                    teCode: pendingReplace.teCode,
                    oldDm: apiOldDm,
                    newDm: apiNewDm,
                    createdAt: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                    status: 'success' as const,
                },
                ...previous,
            ].slice(0, 10));

            setOldDm('');
            setNewDm('');
            setTeCode('');
            setSelectedItemId(null);
            setRows([]);
            setPendingReplace(null);
            setMessage({ type: 'success', text: `Замена выполнена: ${apiOldDm} → ${apiNewDm}` });
            setFlowStatus('replace-success');
            setShowSuccessOverlay(true);

            window.setTimeout(() => {
                setShowSuccessOverlay(false);
                setActiveStage(0);
            }, 2200);
        }
        catch (error) {
            const details = error instanceof Error ? error.message : 'Ошибка при замене DM';
            setMessage({ type: 'error', text: details });
            setFlowStatus('error');
            setActiveStage(2);
        }
        finally {
            setIsReplacing(false);
        }
    }

    return (
        <AppLayout>
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Header
                    title="Замена DM-кодов"
                    description=""
                />

                <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5 lg:p-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(15,23,42,0.03),transparent_45%,rgba(37,99,235,0.06))]" />

                    {showSuccessOverlay && (
                        <div className="absolute inset-0 z-20 grid place-items-center bg-background/80 backdrop-blur-[2px] animate-in fade-in duration-200">
                            <div className="rounded-2xl border border-brand-success/30 bg-brand-success/10 px-6 py-5 text-center shadow-sm">
                                <p className="text-lg font-semibold text-brand-success">Успешно</p>
                                <p className="mt-1 text-sm text-muted-foreground">Замена выполнена. Возврат к шагу 1...</p>
                            </div>
                        </div>
                    )}

                    <div className="relative z-10 space-y-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="max-w-3xl">
                                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                    {currentStage.subtitle}
                                </p>
                                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                                    {currentStage.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                                    {currentStage.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 self-start rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                                <span>Прогресс</span>
                                <span className="font-semibold text-foreground">{activeStage + 1} / {INTRO_STAGES.length}</span>
                            </div>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch">
                            <div className="flex h-full flex-col gap-4">
                                <div className="grid gap-3 md:grid-cols-3 md:auto-rows-fr">
                                    <div className={`flex h-full min-h-[96px] flex-col justify-between rounded-2xl border p-3 shadow-sm transition-colors ${getSummaryCardClasses('neutral', normalizedTeCode.length > 0)}`}>
                                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">ТЕ</p>
                                        <p className="mt-2 break-all font-mono text-sm font-semibold text-foreground">
                                            {normalizedTeCode || '—'}
                                        </p>
                                    </div>

                                    <div className={`flex h-full min-h-[96px] flex-col justify-between rounded-2xl border p-3 shadow-sm transition-colors ${getSummaryCardClasses('old', normalizedOldDm.length > 0)}`}>
                                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Старый DM</p>
                                        <p className={`mt-2 break-all font-mono text-sm font-semibold ${normalizedOldDm ? 'text-red-700' : 'text-foreground'}`}>
                                            {normalizedOldDm || '—'}
                                        </p>
                                    </div>

                                    <div className={`flex h-full min-h-[96px] flex-col justify-between rounded-2xl border p-3 shadow-sm transition-colors ${getSummaryCardClasses('new', (pendingReplace?.newDm || normalizedNewDm).length > 0)}`}>
                                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Новый DM</p>
                                        <p className={`mt-2 break-all font-mono text-sm font-semibold ${(pendingReplace?.newDm || normalizedNewDm) ? 'text-emerald-700' : 'text-foreground'}`}>
                                            {pendingReplace?.newDm || normalizedNewDm || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col rounded-2xl border border-border bg-background/85 p-4 shadow-sm md:p-5">
                                    <div className="flex h-full flex-col">
                                        <div className="flex-1 space-y-4">
                                            {activeStage === 0 && (
                                                <div className="space-y-3">
                                                    <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                                        Транспортная единица
                                                    </label>

                                                    <input
                                                        ref={teInputRef}
                                                        type="text"
                                                        className="h-14 w-full rounded-xl border border-border bg-background px-4 font-mono text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        placeholder="Сканируйте или введите ТЕ"
                                                        value={teCode}
                                                        onChange={(event) => {
                                                            setTeCode(event.target.value);
                                                            setMessage(null);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter') {
                                                                event.preventDefault();
                                                                void handleLoadTe();
                                                            }
                                                        }}
                                                    />

                                                    <button
                                                        type="button"
                                                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                        onClick={() => void handleLoadTe()}
                                                        disabled={isLoadingRows}
                                                    >
                                                        {isLoadingRows ? 'Загрузка...' : 'Загрузить строки ТЕ'}
                                                    </button>
                                                </div>
                                            )}

                                            {activeStage === 1 && (
                                                <div className="space-y-3">
                                                    <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                                        Старый DM
                                                    </label>

                                                    <input
                                                        ref={oldDmInputRef}
                                                        type="text"
                                                        className="h-14 w-full rounded-xl border border-border bg-background px-4 font-mono text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                                                        placeholder="Сканируйте старый DM"
                                                        value={oldDm}
                                                        disabled={rows.length === 0}
                                                        onChange={(event) => {
                                                            setOldDm(event.target.value);
                                                            setPendingReplace(null);
                                                            setNewDm('');
                                                            setMessage(null);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter') {
                                                                event.preventDefault();
                                                                handleOldDmSubmit();
                                                            }
                                                        }}
                                                    />

                                                    <button
                                                        type="button"
                                                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                        onClick={handleOldDmSubmit}
                                                        disabled={rows.length === 0}
                                                    >
                                                        Найти запись
                                                    </button>
                                                </div>
                                            )}

                                            {activeStage === 2 && (
                                                <div className="space-y-3">
                                                    <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                                        Новый DM
                                                    </label>

                                                    <input
                                                        ref={newDmInputRef}
                                                        type="text"
                                                        className="h-14 w-full rounded-xl border border-border bg-background px-4 font-mono text-base text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                                                        placeholder="Сканируйте новый DM"
                                                        value={newDm}
                                                        disabled={!selectedRow}
                                                        onChange={(event) => {
                                                            setNewDm(event.target.value);
                                                            setPendingReplace(null);
                                                            setMessage(null);
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key === 'Enter') {
                                                                event.preventDefault();
                                                                handlePrepareReplace();
                                                            }
                                                        }}
                                                    />

                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        <button
                                                            type="button"
                                                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-all hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-50"
                                                            onClick={handlePrepareReplace}
                                                            disabled={!selectedRow || isReplacing}
                                                        >
                                                            Проверить новый DM
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                            onClick={() => void handleConfirmReplace()}
                                                            disabled={!pendingReplace || isReplacing}
                                                        >
                                                            {isReplacing ? 'Выполняется...' : 'Заменить DM'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 min-h-[64px]">
                                            {message ? (
                                                <div className={`flex min-h-[64px] items-center rounded-xl border px-3 py-2.5 text-sm ${getMessageClasses(message.type)}`}>
                                                    {message.text}
                                                </div>
                                            ) : (
                                                <div className="h-[64px]" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <aside className="flex h-full flex-col rounded-2xl border border-border bg-background/70 p-3 shadow-sm">
                                <div className="flex h-full flex-col gap-2">
                                    {INTRO_STAGES.map((stage, index) => {
                                        const stageState = getStageVisualState(index, activeStage, maxUnlockedStage);
                                        const isLocked = stageState === 'locked';
                                        const isActive = stageState === 'active';

                                        return (
                                            <button
                                                key={stage.id}
                                                type="button"
                                                disabled={isLocked}
                                                onClick={() => {
                                                    if (!isLocked) {
                                                        setActiveStage(index);
                                                    }
                                                }}
                                                className={`flex-1 rounded-2xl border px-4 py-3 text-left transition-all ${
                                                    isActive
                                                        ? 'border-blue-200 bg-blue-50/70 shadow-sm'
                                                        : isLocked
                                                            ? 'cursor-not-allowed border-border bg-background/70 opacity-70'
                                                            : 'border-border bg-background hover:border-slate-300 hover:bg-muted/35'
                                                }`}
                                            >
                                                <div className="flex h-full min-h-[86px] items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                                            Этап {index + 1}
                                                        </p>
                                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                                            {stage.title}
                                                        </p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {getStageStatusLabel(stageState)}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold ${
                                                            isActive
                                                                ? 'border-blue-200 bg-white text-blue-700'
                                                                : stageState === 'done'
                                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                    : 'border-border bg-white text-muted-foreground'
                                                        }`}
                                                    >
                                        {index + 1}
                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </aside>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Прогресс операции</span>
                                <span>{Math.round(progressPercent)}%</span>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a,#2563eb)] transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 md:p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Последние операции замены</h4>
                        <span className="text-xs text-muted-foreground">Показано: {history.length} из 10</span>
                    </div>

                    <div className="hidden overflow-hidden rounded-xl border border-border md:block">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium">Время</th>
                                <th className="px-3 py-2 text-left font-medium">ТЕ</th>
                                <th className="px-3 py-2 text-left font-medium">Старый DM</th>
                                <th className="px-3 py-2 text-left font-medium">Новый DM</th>
                                <th className="px-3 py-2 text-left font-medium">Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map((row) => (
                                <tr key={row.id} className="border-t border-border">
                                    <td className="px-3 py-2 font-mono">{row.createdAt}</td>
                                    <td className="px-3 py-2 font-mono">{row.teCode}</td>
                                    <td className="px-3 py-2 font-mono text-red-700">{row.oldDm}</td>
                                    <td className="px-3 py-2 font-mono text-emerald-700">{row.newDm}</td>
                                    <td className="px-3 py-2">
                                            <span className="rounded-full border border-brand-success/30 bg-brand-success/10 px-2 py-0.5 text-xs text-brand-success">
                                                Успешно
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-2 md:hidden">
                        {history.map((row) => (
                            <article key={row.id} className="rounded-xl border border-border bg-background px-3 py-3">
                                <div className="mb-1 flex items-center justify-between gap-3">
                                    <span className="text-xs text-muted-foreground">{row.createdAt}</span>
                                    <span className="rounded-full border border-brand-success/30 bg-brand-success/10 px-2 py-0.5 text-[11px] text-brand-success">
                                        Успешно
                                    </span>
                                </div>
                                <p className="font-mono text-xs text-muted-foreground">ТЕ: {row.teCode}</p>
                                <p className="mt-1 font-mono text-xs text-red-700">Старый: {row.oldDm}</p>
                                <p className="mt-1 font-mono text-xs text-emerald-700">Новый: {row.newDm}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}