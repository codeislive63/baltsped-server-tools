export type Page = 'catalog' | 'te-viewer' | 'dm-replacement' | 'not-found';
export type Theme = 'dark' | 'light';

export interface ToolItem {
    id: string;
    name: string;
    description: string;
    available: boolean;
    category: string;
}

export interface TeRecord {
    id: string;
    teNumber: string;
    dmCode: string;
    sku: string;
    quantity: number;
    status: 'active' | 'replaced' | 'error';
    timestamp: string;
}
