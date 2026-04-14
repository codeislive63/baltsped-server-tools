import {
    ArrowUpRight,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Layers,
    ShieldCheck,
    TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AppLayout } from '../shared/layout/AppLayout';
import { MOCK_TOOLS } from '../shared/mock/tools';
import { Header } from '../shared/ui/Header';

export function Home() {
    const totalTools = MOCK_TOOLS.length;
    const availableTools = MOCK_TOOLS.filter((tool) => tool.available).length;
    const unavailableTools = totalTools - availableTools;
    const availabilityRate = Math.round((availableTools / totalTools) * 100);
    const uniqueCategories = new Set(MOCK_TOOLS.map((tool) => tool.category)).size;

    const throughputData = [
        { shift: 'Пн', value: 162 },
        { shift: 'Вт', value: 174 },
        { shift: 'Ср', value: 188 },
        { shift: 'Чт', value: 205 },
        { shift: 'Пт', value: 196 },
        { shift: 'Сб', value: 158 },
        { shift: 'Вс', value: 143 },
    ];
    const maxThroughput = Math.max(...throughputData.map((entry) => entry.value));

    function getToolRoute(id: string): string | null {
        if (id === '1') return '/te/lookup';
        if (id === '2') return '/dm/replace';
        return null;
    }

    return (
        <AppLayout>
            <div className="space-y-8 md:space-y-10">
                <Header
                    title="Каталог инструментов"
                    description="Единая рабочая панель для операционных инструментов складской логистики."
                />

                <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-6 md:px-8 md:py-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(37,99,235,0.16),transparent_40%),radial-gradient(circle_at_15%_95%,rgba(37,99,235,0.10),transparent_45%)]" />
                    <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-blue-400/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 left-20 h-44 w-44 rounded-full bg-indigo-500/15 blur-3xl" />

                    <div className="relative z-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                        <div className="space-y-4">
                            <span className="inline-flex items-center rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                Внутренняя B2B панель логистики
                            </span>
                            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                                Операционный центр инструментов для склада и маркировки
                            </h2>
                            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                                Управляйте ключевыми процессами в одном интерфейсе: поиск содержимого ТЕ,
                                работа с DM-кодами и контроль доступности сервисов в реальном времени.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <Button size="lg" asChild>
                                    <Link to="/te/lookup">
                                        Перейти к инструментам
                                        <ChevronRight />
                                    </Link>
                                </Button>
                                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                                    <ShieldCheck className="size-4 text-emerald-500" />
                                    Доступность сервисов: {availabilityRate}%
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 self-start">
                            {[
                                { label: 'Инструментов', value: totalTools, icon: Layers },
                                { label: 'Доступно', value: availableTools, icon: CheckCircle2 },
                                { label: 'Категорий', value: uniqueCategories, icon: TrendingUp },
                                { label: 'Требуют внимания', value: unavailableTools, icon: Clock3 },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-xl border border-border/80 bg-background/80 p-3 backdrop-blur-sm"
                                    >
                                        <div className="mb-2 inline-flex rounded-md bg-muted p-2">
                                            <Icon className="size-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-xl font-semibold">{item.value}</p>
                                        <p className="text-xs text-muted-foreground">{item.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            title: 'Всего инструментов',
                            value: totalTools,
                            description: 'В каталоге рабочей панели',
                        },
                        {
                            title: 'Активные инструменты',
                            value: availableTools,
                            description: 'Готовы к использованию сейчас',
                        },
                        {
                            title: 'SLA доступности',
                            value: `${availabilityRate}%`,
                            description: 'По текущему статусу инструментов',
                        },
                        {
                            title: 'Категории',
                            value: uniqueCategories,
                            description: 'Функциональные направления',
                        },
                    ].map((metric, index) => (
                        <article
                            key={metric.title}
                            className={cn(
                                'rounded-2xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500',
                                index === 1 && 'delay-100',
                                index === 2 && 'delay-150',
                                index === 3 && 'delay-200'
                            )}
                        >
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {metric.title}
                            </p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight">{metric.value}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{metric.description}</p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold">Операционная нагрузка по сменам</h3>
                                <p className="text-sm text-muted-foreground">
                                    Обработанные операции за последние 7 дней
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                                <ArrowUpRight className="size-3.5" />
                                +8.4%
                            </span>
                        </div>

                        <div className="flex h-52 items-end gap-2 rounded-xl border border-border/70 bg-muted/20 p-4">
                            {throughputData.map((entry) => (
                                <div key={entry.shift} className="flex flex-1 flex-col items-center justify-end gap-2">
                                    <div className="flex w-full items-end justify-center rounded-md bg-gradient-to-t from-blue-600/80 to-blue-400/70 transition-all duration-300 hover:from-blue-500 hover:to-blue-300"
                                         style={{ height: `${Math.round((entry.value / maxThroughput) * 140)}px` }}
                                    />
                                    <span className="text-[11px] text-muted-foreground">{entry.shift}</span>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                        <h3 className="text-base font-semibold">Состояние системы</h3>
                        <p className="text-sm text-muted-foreground">Ключевые сигналы за текущую смену</p>

                        <div className="mt-4 space-y-3">
                            {[
                                { label: 'Сканирование ТЕ', value: 'Стабильно', tone: 'bg-emerald-500' },
                                { label: 'DM-операции', value: 'Норма', tone: 'bg-blue-500' },
                                { label: 'Очередь задач', value: 'Умеренная', tone: 'bg-amber-500' },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <span className={cn('size-2.5 rounded-full', row.tone)} />
                                        <span className="text-sm">{row.label}</span>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold tracking-tight">Инструменты</h3>
                        <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
                            {availableTools} из {totalTools} доступны
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {MOCK_TOOLS.map((tool) => (
                        <article
                            key={tool.id}
                            className={cn(
                                'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300',
                                tool.available
                                    ? 'hover:-translate-y-0.5 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/10'
                                    : 'opacity-70'
                            )}
                        >
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,transparent,transparent_55%,rgba(37,99,235,0.08))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative z-10 flex flex-1 flex-col p-5">
                                <div className="mb-4 flex items-start justify-between">
                                    <span className="inline-flex rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                        {tool.category}
                                    </span>
                                    {tool.available ? (
                                        <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                                            Доступен
                                        </span>
                                    ) : (
                                        <span className="inline-flex rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-600 dark:text-rose-300">
                                            Недоступен
                                        </span>
                                    )}
                                </div>

                                <h4 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-300">
                                    {tool.name}
                                </h4>

                                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                                    {tool.description}
                                </p>

                                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                        ID: {tool.id}
                                </span>
                                    {tool.available && getToolRoute(tool.id) ? (
                                        <Button size="sm" variant="outline" asChild>
                                            <Link to={getToolRoute(tool.id) as string}>
                                                Открыть <ChevronRight className="size-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="secondary" disabled>
                                            Недоступно
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                    </div>
                </section>
                </div>
        </AppLayout>
    );
}