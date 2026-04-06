import type { TeRecord } from '../types/app';

export const MOCK_TE_DATA: TeRecord[] = [
    {
        id: 'REC-001',
        teNumber: 'TE-99281',
        dmCode: 'DM-X92-A1',
        sku: 'SKU-8821',
        quantity: 24,
        status: 'active',
        timestamp: '2026-03-30 08:15',
    },
    {
        id: 'REC-002',
        teNumber: 'TE-99281',
        dmCode: 'DM-X92-A2',
        sku: 'SKU-8821',
        quantity: 12,
        status: 'active',
        timestamp: '2026-03-30 08:16',
    },
    {
        id: 'REC-003',
        teNumber: 'TE-99281',
        dmCode: 'DM-X92-A3',
        sku: 'SKU-4410',
        quantity: 50,
        status: 'replaced',
        timestamp: '2026-03-30 09:02',
    },
    {
        id: 'REC-004',
        teNumber: 'TE-44120',
        dmCode: 'DM-Y10-B1',
        sku: 'SKU-1102',
        quantity: 5,
        status: 'error',
        timestamp: '2026-03-30 10:45',
    },
];
