import type { Pump, PumpFormData } from '../types/pump.types';
import { DEMO_PUMPS } from '../utils/mockData';

const STORAGE_KEY = 'pumps';
const VERSION_KEY = 'pumps_version';
const CURRENT_VERSION = '2.0'; // Increment this to force data refresh

// Initialize localStorage with demo data
export const initializeData = () => {
    const storedVersion = localStorage.getItem(VERSION_KEY);

    // Force refresh if version mismatch or no data
    if (storedVersion !== CURRENT_VERSION || !localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PUMPS));
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
};

export const getAll = (): Pump[] => {
    initializeData();
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

export const getById = (id: string): Pump | null => {
    const pumps = getAll();
    return pumps.find(p => p.id === id) || null;
};

export const create = (pumpData: PumpFormData): Pump => {
    const pumps = getAll();
    const newPump: Pump = {
        id: (Math.max(...pumps.map(p => parseInt(p.id)), 0) + 1).toString(),
        name: pumpData.name,
        type: pumpData.type,
        area: pumpData.area,
        location: {
            latitude: pumpData.latitude,
            longitude: pumpData.longitude
        },
        flowRate: pumpData.flowRate,
        offset: pumpData.offset,
        pressure: {
            current: Math.floor(
                Math.random() * (pumpData.maxPressure - pumpData.minPressure) + pumpData.minPressure
            ),
            min: pumpData.minPressure,
            max: pumpData.maxPressure
        },
        status: 'Operational',
        lastUpdated: new Date().toISOString()
    };

    pumps.push(newPump);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pumps));
    return newPump;
};

export const update = (id: string, updates: Partial<PumpFormData>): Pump | null => {
    const pumps = getAll();
    const index = pumps.findIndex(p => p.id === id);

    if (index !== -1) {
        const pump = pumps[index];

        // Update fields if provided
        if (updates.name !== undefined) pump.name = updates.name;
        if (updates.type !== undefined) pump.type = updates.type;
        if (updates.area !== undefined) pump.area = updates.area;
        if (updates.latitude !== undefined) pump.location.latitude = updates.latitude;
        if (updates.longitude !== undefined) pump.location.longitude = updates.longitude;
        if (updates.flowRate !== undefined) pump.flowRate = updates.flowRate;
        if (updates.offset !== undefined) pump.offset = updates.offset;

        // Update pressure if min/max provided
        if (updates.minPressure !== undefined || updates.maxPressure !== undefined) {
            pump.pressure.min = updates.minPressure ?? pump.pressure.min;
            pump.pressure.max = updates.maxPressure ?? pump.pressure.max;
            // Ensure current is within new bounds
            pump.pressure.current = Math.max(
                pump.pressure.min,
                Math.min(pump.pressure.max, pump.pressure.current)
            );
        }

        pump.lastUpdated = new Date().toISOString();

        localStorage.setItem(STORAGE_KEY, JSON.stringify(pumps));
        return pump;
    }

    return null;
};

// Clear all data and reset to demo data
export const resetToDemo = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PUMPS));
}; 