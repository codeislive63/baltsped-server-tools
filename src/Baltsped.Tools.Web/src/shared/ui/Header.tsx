type HeaderProps = {
    title: string;
    description: string;
};

export function Header({ title, description }: HeaderProps) {
    return (
        <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-brand-text mb-2">
                {title}
            </h1>
            <p className="text-brand-text-muted text-sm max-w-2xl">
                {description}
            </p>
        </header>
    );
}
