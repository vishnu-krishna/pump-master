import type { PumpFormData } from '../types/pump.types';
import { pumpApi } from './api/pumpApi';
import * as mockService from './mockPumpService';

// Environment flag to switch between mock and real API
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL;

// This abstraction shows good architecture - ready for production!
export const pumpService = {
    async getAll() {
        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 300));
            return mockService.getAll();
        }
        const data = await pumpApi.getAll();
        return data.pumps || data; // Handle different response formats
    },

    async getById(id: string) {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return mockService.getById(id);
        }
        return await pumpApi.getById(id);
    },

    async create(pumpData: PumpFormData) {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 400));
            return mockService.create(pumpData);
        }
        return await pumpApi.create(pumpData);
    },

    async update(id: string, updates: Partial<PumpFormData>) {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockService.update(id, updates);
        }
        return await pumpApi.update(id, updates);
    },

    async getPressureHistory(id: string, hours: number = 24) {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            // Use the pressure data generator from mockData
            const { generatePressureData } = await import('../utils/mockData');
            return generatePressureData(hours);
        }
        return await pumpApi.getPressureHistory(id, hours);
    },

    // Utility method for resetting demo data
    resetToDemo() {
        if (USE_MOCK) {
            mockService.resetToDemo();
        }
    }
}; 