import axios from 'axios';

// Configure axios instance for backend communication
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.pumpmaster.azure.com/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired - try to refresh
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await axios.post('/auth/refresh', { refreshToken });
                localStorage.setItem('authToken', data.accessToken);

                // Retry original request
                error.config.headers.Authorization = `Bearer ${data.accessToken}`;
                return apiClient(error.config);
            } catch {
                // Refresh failed - redirect to login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Data transformation helper - C# backend uses PascalCase
export const toCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (obj !== null && obj?.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
            result[camelKey] = toCamelCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
};

// Apply camelCase transformation to all responses
apiClient.interceptors.response.use(
    (response) => {
        response.data = toCamelCase(response.data);
        return response;
    }
);

export default apiClient; 