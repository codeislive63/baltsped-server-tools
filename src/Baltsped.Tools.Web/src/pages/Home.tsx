import {
    CheckCircle2,
    ChevronRight,
    Clock3,
    FolderKanban,
    PackageSearch,
    Sparkles,
    Wrench,
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

    const activityData = [
        { label: 'Пн', processed: 148, issues: 3 },
        { label: 'Вт', processed: 164, issues: 2 },
        { label: 'Ср', processed: 172, issues: 4 },
        { label: 'Чт', processed: 191, issues: 1 },
        { label: 'Пт', processed: 183, issues: 2 },
        { label: 'Сб', processed: 156, issues: 5 },
        { label: 'Вс', processed: 138, issues: 3 },
    ];
    const maxProcessed = Math.max(...activityData.map((entry) => entry.processed));

    return (
        <AppLayout>
            <div className="space-y-8 md:space-y-10">
                <Header
                    title="Каталог инструментов"
                    description="Единая рабочая панель для операционных инструментов складской логистики."
                />

                <section className="relative overflow-hidden rounded-[28px] border border-border bg-card px-6 py-6 shadow-sm md:px-8 md:py-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.03),transparent_38%,rgba(37,99,235,0.06)_100%)]" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 border-l border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(241,245,249,0.85))]" />
                    <div className="pointer-events-none absolute right-10 top-8 h-24 w-24 rounded-full border border-blue-100 bg-blue-50/80" />
                    <div className="pointer-events-none absolute bottom-8 right-20 h-14 w-14 rounded-2xl border border-slate-200 bg-white/90 shadow-sm" />

                    <div className="relative z-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                        <div className="space-y-4">
                            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                                Единая рабочая панель для складских и маркировочных операций
                            </h2>
                            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                                Быстрый доступ к ключевым сценариям: проверка и просмотр содержимого ТЕ,
                                операции с DM-кодами, печать сопроводительных материалов и подготовка документов.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <Button size="lg" asChild>
                                    <Link to="/te/lookup">
                                        Перейти к инструментам
                                        <ChevronRight />
                                    </Link>
                                </Button>
                                <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground shadow-sm">
                                    <Sparkles className="size-4 text-slate-500" />
                                    Спокойный light-only интерфейс для ежедневной работы
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 self-start">
                            {[
                                { label: 'Каталог', value: totalTools, icon: FolderKanban },
                                { label: 'Доступно', value: availableTools, icon: CheckCircle2 },
                                { label: 'Ожидают запуска', value: unavailableTools, icon: Clock3 },
                                { label: 'Активный модуль', value: 'ТЕ', icon: PackageSearch },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-border/80 bg-background/90 p-4 shadow-sm"
                                    >
                                        <div className="mb-3 inline-flex rounded-xl bg-muted p-2.5">
                                            <Icon className="size-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-xl font-semibold">{item.value}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
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
                            title: 'Требуют подключения',
                            value: unavailableTools,
                            description: 'Подходящее место для будущих модулей',
                        },
                    ].map((metric, index) => (
                        <article
                            key={metric.title}
                            className={cn(
                                'rounded-2xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500',
                                index === 1 && 'delay-100',
                                index === 2 && 'delay-150'
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
                                <h3 className="text-base font-semibold">Операционная активность по дням</h3>
                                <p className="text-sm text-muted-foreground">
                                    Выполненные операции и количество инцидентов за последнюю неделю
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                7 дней
                            </span>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/[0.18] p-4">
                            <div className="mb-4 grid grid-cols-[1fr_auto_auto] gap-3 border-b border-border/70 pb-3 text-xs text-muted-foreground">
                                <span>День</span>
                                <span>Операции</span>
                                <span>Инциденты</span>
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
                                        <div className="flex min-w-[88px] items-center justify-between gap-3 text-xs">
                                            <span className="font-medium text-foreground">{entry.processed}</span>
                                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                                                {entry.issues}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 grid gap-3 border-t border-border/70 pt-4 md:grid-cols-3">
                                {[
                                    { label: 'Пиковый день', value: 'Чт', icon: Wrench },
                                    { label: 'Операций за неделю', value: '1 152', icon: FolderKanban },
                                    { label: 'Инцидентов', value: '20', icon: Clock3 },
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

                    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold">Доступность сервисов</h3>
                                <p className="text-sm text-muted-foreground">
                                    Базовый foundation-блок для последующей детализации по модулям
                                </p>
                            </div>
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                Placeholder
                            </span>
                        </div>

                        <div className="mt-4 space-y-3">
                            {[
                                {
                                    label: 'Каталог инструментов',
                                    value: 'Работает',
                                    tone: 'bg-emerald-500',
                                    hint: 'Основная навигация доступна.',
                                },
                                {
                                    label: 'Проверка содержимого ТЕ',
                                    value: 'Доступно',
                                    tone: 'bg-blue-500',
                                    hint: 'Модуль открыт для сценариев поиска.',
                                },
                                {
                                    label: 'Будущие модули',
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

                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold tracking-tight">Инструменты</h3>
                        <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
                            {availableTools} из {totalTools} доступны
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {MOCK_TOOLS.map((tool) => (
                        tool.available && tool.route ? (
                            <Link
                                key={tool.id}
                                to={tool.route}
                                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/70 group-focus-visible:border-slate-300 group-focus-visible:shadow-lg group-focus-visible:shadow-slate-200/70">
                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,transparent,transparent_58%,rgba(15,23,42,0.03))]" />
                                    <div className="relative z-10 flex flex-1 flex-col p-5">
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <span className="inline-flex rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                                {tool.category}
                                            </span>
                                            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                                                Доступен
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-slate-900">
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
                                <div className="relative z-10 flex flex-1 flex-col p-5">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <span className="inline-flex rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                            {tool.category}
                                        </span>
                                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                            Скоро
                                        </span>
                                    </div>

                                    <h4 className="text-lg font-semibold tracking-tight text-foreground">
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
                </div>
        </AppLayout>
    );
}