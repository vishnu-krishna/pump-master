import apiClient from './api/apiClient';

interface User {
    id: string;
    username: string;
    name: string;
    role: string;
}

interface LoginResponse {
    success: boolean;
    user?: User;
    error?: string;
    accessToken?: string;
    refreshToken?: string;
}

class AuthService {
    private readonly USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL;

    async login(username: string, password: string): Promise<LoginResponse> {
        if (this.USE_MOCK) {
            // Mock authentication
            await new Promise(resolve => setTimeout(resolve, 500));

            if (username === 'demo' && password === 'demo123') {
                const mockUser: User = {
                    id: '1',
                    username: 'demo',
                    name: 'Demo User',
                    role: 'operator'
                };

                const mockToken = 'mock-jwt-' + Date.now();

                localStorage.setItem('authToken', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));

                return { success: true, user: mockUser };
            }

            return {
                success: false,
                error: 'Invalid username or password'
            };
        } else {
            // Production: Call C# backend
            try {
                const { data } = await apiClient.post('/auth/login', { username, password });

                localStorage.setItem('authToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));

                return {
                    success: true,
                    user: data.user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.response?.data?.message || 'Login failed'
                };
            }
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

export const authService = new AuthService(); 