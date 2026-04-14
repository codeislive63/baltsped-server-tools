import { AlertCircle } from 'lucide-react';
import { AppLayout } from '../shared/layout/AppLayout';
import { Header } from '../shared/ui/Header';

export function NotFound() {
    return (
        <AppLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Header
                    title="Страница не найдена"
                    description="Похоже, что для этого маршрута страница ещё не создана или адрес введён неверно."
                />

                <div className="card-brand p-12 flex flex-col items-center justify-center text-center border-dashed border-2 opacity-70">
                    <AlertCircle size={48} className="text-brand-warning mb-4" />
                    <p className="text-brand-text-muted">
                        Вернитесь в каталог инструментов и откройте доступный раздел.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
