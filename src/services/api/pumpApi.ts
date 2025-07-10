import apiClient from './apiClient';
import type { Pump, PumpFormData } from '../../types/pump.types';

// API endpoints for pump operations - matching C# Web API controller routes
const PUMP_API_ENDPOINTS = {
    BASE: '/api/pumps',
    BY_ID: (id: string) => `/api/pumps/${id}`,
    BY_AREA: (area: string) => `/api/pumps/area/${encodeURIComponent(area)}`,
    STATISTICS: '/api/pumps/statistics',
    EXPORT: '/api/pumps/export'
};

// Pump API service for C# backend integration
export const pumpApi = {
    /**
     * Get all pumps with optional filtering and pagination
     * GET /api/pumps?type={type}&status={status}&page={page}&pageSize={pageSize}
     *
     * C# Controller Example:
     * [HttpGet]
     * public async Task<ActionResult<PaginatedResponse<PumpDto>>> GetPumps(
     *     [FromQuery] string? type,
     *     [FromQuery] string? status,
     *     [FromQuery] int page = 1,
     *     [FromQuery] int pageSize = 20)
     */
    async getAll(params?: {
        type?: string;
        status?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{ pumps: Pump[]; totalCount: number; page: number; pageSize: number }> {
        const response = await apiClient.get(PUMP_API_ENDPOINTS.BASE, { params });
        return response.data;
    },

    /**
     * Get a single pump by ID
     * GET /api/pumps/{id}
     *
     * C# Controller Example:
     * [HttpGet("{id}")]
     * public async Task<ActionResult<PumpDto>> GetPump(Guid id)
     */
    async getById(id: string): Promise<Pump> {
        const response = await apiClient.get(PUMP_API_ENDPOINTS.BY_ID(id));
        return response.data;
    },

    /**
     * Create a new pump
     * POST /api/pumps
     *
     * C# Controller Example:
     * [HttpPost]
     * public async Task<ActionResult<PumpDto>> CreatePump([FromBody] CreatePumpDto pumpDto)
     */
    async create(pumpData: PumpFormData): Promise<Pump> {
        const response = await apiClient.post(PUMP_API_ENDPOINTS.BASE, pumpData);
        return response.data;
    },

    /**
     * Update an existing pump
     * PUT /api/pumps/{id}
     *
     * C# Controller Example:
     * [HttpPut("{id}")]
     * public async Task<ActionResult<PumpDto>> UpdatePump(
     *     Guid id,
     *     [FromBody] UpdatePumpDto pumpDto)
     */
    async update(id: string, pumpData: Partial<PumpFormData>): Promise<Pump> {
        const response = await apiClient.put(PUMP_API_ENDPOINTS.BY_ID(id), pumpData);
        return response.data;
    },

    /**
     * Delete a pump
     * DELETE /api/pumps/{id}
     *
     * C# Controller Example:
     * [HttpDelete("{id}")]
     * public async Task<IActionResult> DeletePump(Guid id)
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(PUMP_API_ENDPOINTS.BY_ID(id));
    },

    /**
     * Get pumps by area
     * GET /api/pumps/area/{area}
     *
     * C# Controller Example:
     * [HttpGet("area/{area}")]
     * public async Task<ActionResult<List<PumpDto>>> GetPumpsByArea(string area)
     */
    async getByArea(area: string): Promise<Pump[]> {
        const response = await apiClient.get(PUMP_API_ENDPOINTS.BY_AREA(area));
        return response.data;
    },

    /**
     * Get pump statistics
     * GET /api/pumps/statistics
     *
     * C# Controller Example:
     * [HttpGet("statistics")]
     * public async Task<ActionResult<PumpStatisticsDto>> GetStatistics()
     */
    async getStatistics(): Promise<{
        totalPumps: number;
        operationalPumps: number;
        warningPumps: number;
        errorPumps: number;
        maintenancePumps: number;
        averageFlowRate: number;
        averagePressure: number;
    }> {
        const response = await apiClient.get(PUMP_API_ENDPOINTS.STATISTICS);
        return response.data;
    },

    /**
     * Export pumps data
     * GET /api/pumps/export?format={format}
     *
     * C# Controller Example:
     * [HttpGet("export")]
     * public async Task<IActionResult> ExportPumps([FromQuery] string format = "csv")
     */
    async exportData(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
        const response = await apiClient.get(PUMP_API_ENDPOINTS.EXPORT, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    }
};