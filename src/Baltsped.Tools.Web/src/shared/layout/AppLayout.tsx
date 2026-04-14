import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Sidebar } from '../ui/Sidebar';
import type { Theme } from '../types/app';

type AppLayoutProps = PropsWithChildren;

const themeStorageKey = 'baltsped-tools-theme';
const sidebarStorageKey = 'baltsped-tools-sidebar-open';

export function AppLayout({ children }: AppLayoutProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return 'dark';
        }

        const savedTheme = window.localStorage.getItem(themeStorageKey);
        return savedTheme === 'light' ? 'light' : 'dark';
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return true;
        }

        const savedValue = window.localStorage.getItem(sidebarStorageKey);
        return savedValue !== 'false';
    });

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.add('light');
        }
        else {
            document.documentElement.classList.remove('light');
        }

        window.localStorage.setItem(themeStorageKey, theme);
    }, [theme]);

    useEffect(() => {
        window.localStorage.setItem(sidebarStorageKey, String(isSidebarOpen));
    }, [isSidebarOpen]);

    function toggleTheme(): void {
        setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
    }

    function toggleSidebar(): void {
        setIsSidebarOpen(currentValue => !currentValue);
    }

    return (
        <div className="flex min-h-screen bg-brand-bg text-brand-text">
            <Sidebar
                theme={theme}
                toggleTheme={toggleTheme}
                isOpen={isSidebarOpen}
                toggleOpen={toggleSidebar}
            />

            <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">
                {children}
            </main>

            <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.05]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(var(--brand-text-dim) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>
        </div>
    );
}
