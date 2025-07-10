import axios from 'axios';
import { authService } from '../authService';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.pumpmaster.com',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for authentication and request transformation
apiClient.interceptors.request.use(
    (config) => {
        // Add JWT token to all requests
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Transform camelCase to PascalCase for C# backend compatibility
        if (config.data) {
            config.data = toPascalCase(config.data);
        }

        // Add correlation ID for request tracking
        config.headers['X-Correlation-ID'] = generateCorrelationId();

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and data transformation
apiClient.interceptors.response.use(
    (response) => {
        // Transform PascalCase from C# to camelCase for JavaScript
        if (response.data) {
            response.data = toCamelCase(response.data);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    // Call C# backend refresh endpoint
                    const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
                        refreshToken
                    });

                    // Update tokens
                    localStorage.setItem('authToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                authService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other HTTP errors
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    // Bad Request - show validation errors from C# ModelState
                    console.error('Validation Error:', error.response.data.errors);
                    break;
                case 403:
                    // Forbidden - insufficient permissions
                    console.error('Access Denied:', error.response.data.message);
                    break;
                case 404:
                    // Not Found
                    console.error('Resource Not Found:', error.response.data.message);
                    break;
                case 500:
                    // Internal Server Error
                    console.error('Server Error:', error.response.data.message);
                    break;
            }
        }

        return Promise.reject(error);
    }
);

// Utility function to convert JavaScript camelCase to C# PascalCase
function toPascalCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(v => toPascalCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
            result[pascalKey] = toPascalCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
}

// Utility function to convert C# PascalCase to JavaScript camelCase
function toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
            result[camelKey] = toCamelCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
}

// Generate unique correlation ID for request tracking
function generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default apiClient;

// Example usage with C# backend endpoints:
/*
// GET /api/pumps
const getPumps = async () => {
    const response = await apiClient.get('/pumps');
    return response.data; // Automatically converted from PascalCase to camelCase
};

// POST /api/pumps
const createPump = async (pump: PumpFormData) => {
    const response = await apiClient.post('/pumps', pump); // Automatically converted to PascalCase
    return response.data;
};

// PUT /api/pumps/{id}
const updatePump = async (id: string, pump: Partial<PumpFormData>) => {
    const response = await apiClient.put(`/pumps/${id}`, pump);
    return response.data;
};

// DELETE /api/pumps/{id}
const deletePump = async (id: string) => {
    await apiClient.delete(`/pumps/${id}`);
};
*/ 