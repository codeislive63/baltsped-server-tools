import {
    Blocks,
    CircleUserRound,
    QrCode,
    ScanLine,
    Menu,
    X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

type SidebarProps = {
    isOpen: boolean;
    toggleOpen: () => void;
};

type NavItem = {
    label: string;
    href: string;
    icon: typeof Blocks;
    end?: boolean;
};

const navItems: NavItem[] = [
    {
        label: 'Инструменты',
        href: '/',
        icon: Blocks,
        end: true,
    },
    {
        label: 'Проверка ТЕ',
        href: '/te/lookup',
        icon: ScanLine,
    },
    {
        label: 'ДМ коды',
        href: '/dm/replace',
        icon: QrCode,
    },
];

export function Sidebar({
                            isOpen,
                            toggleOpen,
                        }: SidebarProps) {
    return (
        <aside className={`${isOpen ? 'w-72' : 'w-22'} flex h-screen sticky top-0 flex-col border-r border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85`}>
            <div className={`flex items-center border-b border-border px-4 py-4 ${isOpen ? 'justify-between' : 'justify-center'}`}>
                {isOpen && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200 bg-gradient-to-br from-slate-900 to-slate-700 shadow-sm">
                            <div className="grid grid-cols-2 gap-1">
                                <span className="size-1.5 rounded-[2px] bg-white/90" />
                                <span className="size-1.5 rounded-[2px] bg-blue-200" />
                                <span className="size-1.5 rounded-[2px] bg-blue-200" />
                                <span className="size-1.5 rounded-[2px] bg-white/90" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-tight text-foreground">Baltsped Tools</p>
                            <p className="text-xs text-muted-foreground">Warehouse Operations</p>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={toggleOpen}
                    className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={isOpen ? 'Свернуть боковую панель' : 'Развернуть боковую панель'}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-5">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.end}
                            className={({ isActive }) =>
                                `group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all ${
                                    isActive
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                                } ${isOpen ? 'justify-start px-4' : 'justify-center'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={20}
                                        className={
                                            isActive
                                                ? 'text-white'
                                                : 'text-slate-400 group-hover:text-foreground'
                                        }
                                    />
                                    {isOpen && <span className="font-medium text-sm">{item.label}</span>}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-border p-4">
                <div className={`flex items-center gap-3 rounded-2xl border border-border bg-background px-3 py-3 ${isOpen ? '' : 'justify-center px-0'}`}>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-slate-700">
                        <CircleUserRound size={18} />
                    </div>
                    {isOpen && (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">Дмитрий Орлов</p>
                            <p className="truncate text-xs text-muted-foreground">
                                Supervisor · role model: warehouse.supervisor
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
