type ToolCardModel = {
    title: string;
    description: string;
    route: string;
    isAvailable: boolean;
};

const tools: ToolCardModel[] = [
    {
        title: 'Печать листов вброса',
        description: 'Подготовка и печать рабочих листов',
        route: '/documents/stuffing-sheet',
        isAvailable: false,
    },
    {
        title: 'Проверка содержимого ТЕ',
        description: 'Проверка состава транспортной единицы',
        route: '/te/check',
        isAvailable: false,
    },
    {
        title: 'Просмотр содержимого ТЕ',
        description: 'Просмотр содержимого по номеру ТЕ',
        route: '/te/lookup',
        isAvailable: true,
    },
    {
        title: 'Создание заказа ДМ',
        description: 'Формирование заказа для DM-операций',
        route: '/dm/order',
        isAvailable: false,
    },
    {
        title: 'DM-коды',
        description: 'Замена DM-кодов и связанные операции',
        route: '/dm/replace',
        isAvailable: true,
    },
    {
        title: 'Составление ЗНТ',
        description: 'Формирование ЗНТ по данным системы',
        route: '/box-master',
        isAvailable: false,
    },
];

export function Home() {
    return (
        <main className="app-shell">
            <header className="page-header">
                <h1 className="page-title">Каталог инструментов</h1>
                <p className="page-description">
                    React UI для складских инструментов с серверной частью на C#
                </p>
            </header>

            <section className="tool-grid">
                {tools.map((tool) => (
                    tool.isAvailable
                        ? (
                            <a
                                key={tool.route}
                                href={tool.route}
                                className="tool-card"
                            >
                                <span className="badge badge-success">Доступен</span>
                                <h2 className="tool-title">{tool.title}</h2>
                                <p className="tool-description">{tool.description}</p>
                                <span className="tool-link">Открыть →</span>
                            </a>
                        )
                        : (
                            <div
                                key={tool.route}
                                className="tool-card tool-card-disabled"
                            >
                                <span className="badge badge-muted">Недоступен</span>
                                <h2 className="tool-title">{tool.title}</h2>
                                <p className="tool-description">{tool.description}</p>
                                <span className="tool-link tool-link-disabled">Недоступен</span>
                            </div>
                        )
                ))}
            </section>
        </main>
    );
}
