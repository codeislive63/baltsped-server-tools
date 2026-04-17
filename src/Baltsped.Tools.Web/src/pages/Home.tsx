import {
    ChevronRight,
    FolderKanban,
    Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AppLayout } from '../shared/layout/AppLayout';
import { MOCK_TOOLS } from '../shared/mock/tools';
import { Header } from '../shared/ui/Header';

export function Home() {
    const totalTools = MOCK_TOOLS.length;
    const readyTools = MOCK_TOOLS.filter((tool) => tool.available && tool.route).length;
    const unavailableTools = totalTools - readyTools;

    const activityData = [
        { label: 'Пн', processed: 148 },
        { label: 'Вт', processed: 164 },
        { label: 'Ср', processed: 172 },
        { label: 'Чт', processed: 191 },
        { label: 'Пт', processed: 183 },
        { label: 'Сб', processed: 156 },
        { label: 'Вс', processed: 138 },
    ];
    const maxProcessed = Math.max(...activityData.map((entry) => entry.processed));

    return (
        <AppLayout>
            <div className="space-y-6 md:space-y-8 xl:space-y-10">
                <Header
                    title="Панель ТЕ и DM-операций"
                    description={""}
                />

                <section className="space-y-3 md:space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold tracking-tight md:text-xl">Инструменты</h3>
                        <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
                            {readyTools} из {totalTools} готовы к работе
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 2xl:grid-cols-3">
                        {MOCK_TOOLS.map((tool) => (
                            tool.available && tool.route ? (
                                <Link
                                    key={tool.id}
                                    to={tool.route}
                                    className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/70 group-focus-visible:border-slate-300 group-focus-visible:shadow-lg group-focus-visible:shadow-slate-200/70">
                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,transparent,transparent_58%,rgba(15,23,42,0.03))]" />
                                        <div className="relative z-10 flex flex-1 flex-col p-4 md:p-5">
                                            <div className="mb-4 flex items-start justify-between gap-3">
                                                <span className="inline-flex rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                                    {tool.category}
                                                </span>
                                                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                                                    Готово
                                                </span>
                                            </div>

                                            <h4 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-slate-900 md:text-lg">
                                                {tool.name}
                                            </h4>

                                            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                                                {tool.description}
                                            </p>

                                            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                                    ID: {tool.id}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                                                    Открыть
                                                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ) : (
                                <article
                                    key={tool.id}
                                    className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/80 opacity-75"
                                >
                                    <div className="relative z-10 flex flex-1 flex-col p-4 md:p-5">
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <span className="inline-flex rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                                {tool.category}
                                            </span>
                                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                                Ожидает
                                            </span>
                                        </div>

                                        <h4 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                                            {tool.name}
                                        </h4>

                                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                                            {tool.description}
                                        </p>

                                        <div className="mt-5 border-t border-border pt-4">
                                            <p className="text-xs leading-relaxed text-muted-foreground">
                                                {tool.availabilityHint ?? 'Модуль пока недоступен.'}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            )
                        ))}
                    </div>
                </section>

                <section className="grid gap-3 md:gap-4 xl:grid-cols-[1.4fr_1fr]">
                    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 md:p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold">Операционная активность по дням</h3>
                                <p className="text-sm text-muted-foreground">
                                    Выполненные операции за последнюю неделю
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                7 дней
                            </span>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/18 p-4">
                            <div className="mb-4 grid grid-cols-[1fr_auto] gap-3 border-b border-border/70 pb-3 text-xs text-muted-foreground">
                                <span>День</span>
                                <span>Операции</span>
                            </div>
                            <div className="space-y-3">
                                {activityData.map((entry) => (
                                    <div key={entry.label} className="grid grid-cols-[40px_1fr_auto] items-center gap-3">
                                        <span className="text-sm font-medium text-foreground">{entry.label}</span>
                                        <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a,#2563eb)] transition-all duration-500"
                                                style={{ width: `${Math.round((entry.processed / maxProcessed) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="min-w-11 text-right text-sm font-semibold text-foreground">{entry.processed}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 grid gap-3 border-t border-border/70 pt-4 md:grid-cols-2">
                                {[
                                    { label: 'Пиковый день', value: 'Чт', icon: Wrench },
                                    { label: 'Операций за неделю', value: '1 152', icon: FolderKanban },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.label} className="rounded-xl border border-border bg-background px-3 py-3">
                                            <div className="mb-2 inline-flex rounded-lg bg-muted p-2">
                                                <Icon className="size-4 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">{item.label}</p>
                                            <p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 md:p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold">Доступность сервисов</h3>
                                <p className="text-sm text-muted-foreground">
                                    Базовый foundation-блок для последующей детализации по модулям
                                </p>
                            </div>
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                Placeholder
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            {[
                                {
                                    label: 'Каталог инструментов',
                                    value: 'Работает',
                                    tone: 'bg-emerald-500',
                                    hint: 'Основная навигация стабильна.',
                                },
                                {
                                    label: 'Проверка содержимого ТЕ',
                                    value: 'Доступно',
                                    tone: 'bg-blue-500',
                                    hint: 'Модуль открыт для сценариев поиска.',
                                },
                                {
                                    label: 'ДМ коды',
                                    value: 'Доступно',
                                    tone: 'bg-blue-500',
                                    hint: 'Рабочий маршрут доступен для операций замены.',
                                },
                                {
                                    label: 'Остальные модули',
                                    value: 'Ожидают',
                                    tone: 'bg-slate-400',
                                    hint: 'Здесь можно показать причину недоступности.',
                                },
                            ].map((row) => (
                                <div key={row.label} className="rounded-xl border border-border bg-background p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className={cn('size-2.5 rounded-full', row.tone)} />
                                            <span className="text-sm font-medium text-foreground">{row.label}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{row.value}</span>
                                    </div>
                                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{row.hint}</p>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="grid gap-3 md:grid-cols-3 md:gap-4">
                    {[
                        {
                            title: 'Всего инструментов',
                            value: totalTools,
                            description: 'В каталоге рабочей панели',
                        },
                        {
                            title: 'Feature-ready',
                            value: readyTools,
                            description: 'Реально готовые рабочие сценарии',
                        },
                        {
                            title: 'Ожидают подключения',
                            value: unavailableTools,
                            description: 'Модули следующего этапа',
                        },
                    ].map((metric, index) => (
                        <article
                            key={metric.title}
                            className={cn(
                                'rounded-2xl border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 md:p-5',
                                index === 1 && 'delay-100',
                                index === 2 && 'delay-150'
                            )}
                        >
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {metric.title}
                            </p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{metric.value}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{metric.description}</p>
                        </article>
                    ))}
                </section>

            </div>
        </AppLayout>
    );
}