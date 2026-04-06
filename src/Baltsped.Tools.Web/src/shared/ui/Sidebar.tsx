import {
    LayoutGrid,
    Search,
    RefreshCcw,
    Package,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Page, Theme } from '../types/app';

type SidebarProps = {
    activePage: Page;
    theme: Theme;
    toggleTheme: () => void;
    isOpen: boolean;
    toggleOpen: () => void;
};

type NavItem = {
    id: Page;
    label: string;
    href: string;
    icon: typeof LayoutGrid;
};

const navItems: NavItem[] = [
    { id: 'catalog', label: 'Инструменты', href: '/', icon: LayoutGrid },
    { id: 'te-viewer', label: 'Содержимое ТЕ', href: '/te/lookup', icon: Search },
    { id: 'dm-replacement', label: 'Замена DM-кодов', href: '/dm/replace', icon: RefreshCcw },
];

export function Sidebar({
                            activePage,
                            theme,
                            toggleTheme,
                            isOpen,
                            toggleOpen,
                        }: SidebarProps) {
    return (
        <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-brand-surface border-r border-brand-border flex flex-col h-screen sticky top-0`}>
            <div className={`p-6 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
                {isOpen && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-primary rounded-brand flex items-center justify-center">
                            <Package className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight uppercase">Baltsped</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={toggleOpen}
                    className="p-1 hover:bg-brand-surface-light rounded-brand text-brand-text-muted"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-1 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            to={item.href}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-brand group ${
                                activePage === item.id
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                    : 'text-brand-text-muted hover:bg-brand-surface-light hover:text-brand-text'
                            } ${isOpen ? 'justify-start px-4' : 'justify-center'}`}
                        >
                            <Icon
                                size={20}
                                className={
                                    activePage === item.id
                                        ? 'text-white'
                                        : 'text-brand-text-dim group-hover:text-brand-text'
                                }
                            />
                            {isOpen && <span className="font-medium text-sm">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-brand-border space-y-4">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-brand hover:bg-brand-surface-light text-brand-text-muted hover:text-brand-text ${
                        isOpen ? 'justify-start px-4' : 'justify-center'
                    }`}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    {isOpen && (
                        <span className="font-medium text-sm">
                            {theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
                        </span>
                    )}
                </button>

                <div className={`flex items-center gap-3 ${isOpen ? 'px-4' : 'justify-center'}`}>
                    <div className="w-8 h-8 rounded-full bg-brand-surface-light border border-brand-border flex items-center justify-center text-xs font-bold text-brand-accent">
                        JD
                    </div>

                    {isOpen && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-semibold truncate">John Doe</p>
                                <p className="text-[10px] text-brand-text-dim truncate">Logistics Manager</p>
                            </div>
                            <LogOut size={14} className="text-brand-text-dim hover:text-brand-error cursor-pointer" />
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
