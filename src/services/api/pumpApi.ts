import type { PumpFormData } from '../../types/pump.types';
import apiClient from './apiClient';

export const pumpApi = {
    // GET /api/pumps
    async getAll(params?: { search?: string; type?: string; page?: number }) {
        const { data } = await apiClient.get('/pumps', { params });
        return data;
    },

    // GET /api/pumps/:id
    async getById(id: string) {
        const { data } = await apiClient.get(`/pumps/${id}`);
        return data;
    },

    // POST /api/pumps
    async create(pump: PumpFormData) {
        const { data } = await apiClient.post('/pumps', pump);
        return data;
    },

    // PUT /api/pumps/:id
    async update(id: string, updates: Partial<PumpFormData>) {
        const { data } = await apiClient.put(`/pumps/${id}`, updates);
        return data;
    },

    // GET /api/pumps/:id/pressure-history
    async getPressureHistory(id: string, hours: number = 24) {
        const { data } = await apiClient.get(`/pumps/${id}/pressure-history`, {
            params: { hours }
        });
        return data;
    }
}; 