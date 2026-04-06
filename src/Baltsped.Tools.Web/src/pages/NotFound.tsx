export function NotFound() {
    return (
        <main className="app-shell">
            <a href="/" className="back-link">Назад к каталогу</a>

            <header className="page-header">
                <h1 className="page-title">Страница не найдена</h1>
                <p className="page-description">
                    Для этого маршрута React-страница пока не создана
                </p>
            </header>

            <section className="empty-state">
                Вернитесь в каталог и откройте доступный инструмент
            </section>
        </main>
    );
}
