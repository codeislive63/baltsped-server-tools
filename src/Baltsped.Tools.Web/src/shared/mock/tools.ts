import type { ToolItem } from '../types/app';

export const MOCK_TOOLS: ToolItem[] = [
    {
        id: '1',
        name: 'TE Scanner Pro',
        description: 'Advanced scanning tool for transport units with multi-code support.',
        available: true,
        category: 'Scanning',
    },
    {
        id: '2',
        name: 'DM Code Generator',
        description: 'Bulk generation of DataMatrix codes for internal labeling.',
        available: true,
        category: 'Labeling',
    },
    {
        id: '3',
        name: 'Route Optimizer v2',
        description: 'Intelligent routing for internal warehouse logistics.',
        available: false,
        category: 'Logistics',
    },
    {
        id: '4',
        name: 'Inventory Auditor',
        description: 'Real-time inventory reconciliation and audit tool.',
        available: true,
        category: 'Audit',
    },
    {
        id: '5',
        name: 'Pallet Tracker',
        description: 'RFID-based tracking system for heavy pallet movement.',
        available: true,
        category: 'Tracking',
    },
    {
        id: '6',
        name: 'Label Printer Link',
        description: 'Direct interface for industrial thermal printers.',
        available: false,
        category: 'Labeling',
    },
];
