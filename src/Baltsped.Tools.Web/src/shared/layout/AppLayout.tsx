import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Sidebar } from '../ui/Sidebar';
import type { Page, Theme } from '../types/app';

type AppLayoutProps = PropsWithChildren<{
    activePage: Page;
}>;

const themeStorageKey = 'baltsped-tools-theme';

export function AppLayout({ activePage, children }: AppLayoutProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return 'dark';
        }

        const savedTheme = window.localStorage.getItem(themeStorageKey);

        return savedTheme === 'light' ? 'light' : 'dark';
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

    function toggleTheme(): void {
        setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
    }

    return (
        <div className="flex min-h-screen bg-brand-bg text-brand-text">
            <Sidebar
                activePage={activePage}
                theme={theme}
                toggleTheme={toggleTheme}
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
