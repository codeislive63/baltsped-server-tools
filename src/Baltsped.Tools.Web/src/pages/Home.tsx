import { ChevronRight } from 'lucide-react';
import { AppLayout } from '../shared/layout/AppLayout';
import { MOCK_TOOLS } from '../shared/mock/tools';
import { Header } from '../shared/ui/Header';

export function Home() {
    return (
        <AppLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Header
                    title="Каталог инструментов"
                    description=""
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_TOOLS.map((tool) => (
                        <div
                            key={tool.id}
                            className={`card-brand group relative flex flex-col h-full ${!tool.available ? 'opacity-60 grayscale' : ''}`}
                        >
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="badge badge-neutral">{tool.category}</span>
                                    {tool.available ? (
                                        <span className="badge badge-success">Доступен</span>
                                    ) : (
                                        <span className="badge badge-error">Недоступен</span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold mb-2 group-hover:text-brand-accent">
                                    {tool.name}
                                </h3>

                                <p className="text-sm text-brand-text-muted leading-relaxed">
                                    {tool.description}
                                </p>
                            </div>

                            <div className="px-6 py-4 bg-brand-surface-light/30 border-t border-brand-border flex justify-between items-center">
                                <span className="text-[10px] text-brand-text-dim uppercase font-bold tracking-widest">
                                    ID: {tool.id}
                                </span>

                                <button
                                    type="button"
                                    disabled={!tool.available}
                                    className="text-brand-primary font-bold text-xs flex items-center gap-1 hover:underline disabled:no-underline"
                                >
                                    Открыть <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}