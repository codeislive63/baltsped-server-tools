import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Sidebar } from '../ui/Sidebar';

type AppLayoutProps = PropsWithChildren;

const sidebarStorageKey = 'baltsped-tools-sidebar-open';

export function AppLayout({ children }: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return true;
        }

        const savedValue = window.localStorage.getItem(sidebarStorageKey);
        return savedValue !== 'false';
    });

    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        window.localStorage.setItem(sidebarStorageKey, String(isSidebarOpen));
    }, [isSidebarOpen]);

    function toggleSidebar(): void {
        setIsSidebarOpen(currentValue => !currentValue);
    }

    return (
        <div className="flex min-h-screen bg-brand-bg text-brand-text">
            <Sidebar
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
