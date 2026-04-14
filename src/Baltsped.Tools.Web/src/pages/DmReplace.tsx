import { useState } from 'react';
import {
    AlertCircle,
    ArrowRightLeft,
    CheckCircle2,
    Filter,
    RefreshCcw,
    XCircle,
} from 'lucide-react';
import { AppLayout } from '../shared/layout/AppLayout';
import { MOCK_TE_DATA } from '../shared/mock/teData';
import type { TeRecord } from '../shared/types/app';
import { Header } from '../shared/ui/Header';

type MessageModel = {
    type: 'success' | 'error' | 'warning';
    text: string;
};

export function DmReplace() {
    const [te, setTe] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [data, setData] = useState<TeRecord[]>([]);
    const [message, setMessage] = useState<MessageModel | null>(null);

    function handleSearch(): void {
        const normalizedTe = te.trim();

        if (normalizedTe.length === 0) {
            return;
        }

        setIsSearching(true);

        window.setTimeout(() => {
            setData(MOCK_TE_DATA.filter(record => record.teNumber === normalizedTe));
            setIsSearching(false);

            if (normalizedTe === 'TE-44120') {
                setMessage({
                    type: 'warning',
                    text: 'Обнаружены критические ошибки в структуре ТЕ. Требуется ручная проверка.',
                });
            }
            else {
                setMessage(null);
            }
        }, 600);
    }

    function replaceCode(id: string): void {
        setData(previousData =>
            previousData.map(item =>
                item.id === id
                    ? {
                        ...item,
                        status: 'replaced',
                        dmCode: `DM-NEW-${Math.floor(Math.random() * 1000)}`,
                    }
                    : item,
            ),
        );

        setMessage({
            type: 'success',
            text: `DM-код для записи ${id} успешно обновлен.`,
        });
    }

    return (
        <AppLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Header
                    title="Замена DM-кодов"
                    description="Инструмент для оперативной замены поврежденных или некорректных DataMatrix кодов в рамках транспортной единицы."
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="card-brand p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-muted mb-4 flex items-center gap-2">
                                <Filter size={16} /> Поиск ТЕ
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-text-dim uppercase mb-1.5">
                                        Номер ТЕ
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder="Напр. TE-99281"
                                        value={te}
                                        onChange={(event) => setTe(event.target.value)}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    disabled={isSearching || te.trim().length === 0}
                                    className="btn-primary w-full"
                                >
                                    {isSearching ? <RefreshCcw size={18} className="animate-spin" /> : 'Загрузить данные'}
                                </button>
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
                    </div>

                    <div className="lg:col-span-2">
                        {data.length > 0 ? (
                            <div className="table-container">
                                <table className="table-brand">
                                    <thead>
                                    <tr>
                                        <th>DM Код</th>
                                        <th>SKU</th>
                                        <th>Статус</th>
                                        <th className="text-right">Действие</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.map((row) => (
                                        <tr key={row.id}>
                                            <td className="font-mono font-bold">{row.dmCode}</td>
                                            <td className="font-mono text-xs">{row.sku}</td>
                                            <td>
                                                    <span
                                                        className={`badge ${
                                                            row.status === 'active'
                                                                ? 'badge-success'
                                                                : row.status === 'replaced'
                                                                    ? 'badge-warning'
                                                                    : 'badge-error'
                                                        }`}
                                                    >
                                                        {row.status}
                                                    </span>
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => replaceCode(row.id)}
                                                    disabled={row.status === 'replaced'}
                                                    className="btn-secondary py-1 px-3 text-xs"
                                                >
                                                    <ArrowRightLeft size={14} /> Заменить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="card-brand p-12 flex flex-col items-center justify-center text-center border-dashed border-2 opacity-50 h-full">
                                <RefreshCcw size={48} className="text-brand-text-dim mb-4" />
                                <p className="text-brand-text-muted">Загрузите данные ТЕ для начала работы</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
