// Pump type definitions
export type PumpType = 'Centrifugal' | 'Submersible' | 'Diaphragm' | 'Rotary' | 'Peristaltic';
export type PumpStatus = 'Operational' | 'Warning' | 'Error' | 'Maintenance';

export interface PumpLocation {
    latitude: number;
    longitude: number;
}

export interface PumpPressure {
    current: number;  // PSI
    min: number;      // PSI
    max: number;      // PSI
}

export interface Pump {
    id: string;
    name: string;                    // "Pump 1", "Pump 2", etc.
    type: PumpType;                  // Centrifugal, Submersible, etc.
    area: string;                    // "Area A", "Area B", etc.
    location: PumpLocation;
    flowRate: number;                // GPM (Gallons Per Minute)
    offset: number;                  // seconds
    pressure: PumpPressure;
    status: PumpStatus;
    lastUpdated: string;             // ISO timestamp
}

// Form data type for creating/editing pumps
export interface PumpFormData {
    name: string;
    type: PumpType;
    area: string;
    latitude: number;
    longitude: number;
    flowRate: number;
    offset: number;
    minPressure: number;
    maxPressure: number;
}

// API response types
export interface PumpListResponse {
    pumps: Pump[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
} 