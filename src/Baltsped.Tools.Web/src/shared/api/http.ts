type ProblemDetailsModel = {
    title?: string;
    detail?: string;
};

export async function getJson<TResponse>(url: string): Promise<TResponse> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(await readErrorMessageAsync(response));
    }

    return response.json() as Promise<TResponse>;
}

export async function postJson<TResponse, TRequest>(
    url: string,
    body: TRequest
): Promise<TResponse> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessageAsync(response));
    }

    return response.json() as Promise<TResponse>;
}

async function readErrorMessageAsync(response: Response): Promise<string> {
    const problem = await response.json().catch(() => null) as ProblemDetailsModel | null;

    return problem?.detail
        ?? problem?.title
        ?? `Ошибка запроса (${response.status})`;
}
