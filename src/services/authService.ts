import apiClient from './api/apiClient';
import { DEMO_CREDENTIALS } from '../utils/mockData';

interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    error?: string;
}

class AuthService {
    private readonly AUTH_TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user_data';

    async login(username: string, password: string): Promise<LoginResponse> {
        const useMock = import.meta.env.VITE_USE_MOCK === 'true';

        if (useMock) {
            // Mock authentication
            if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
                const mockToken = 'mock_jwt_token_' + Date.now();
                this.setToken(mockToken);
                this.setUser(DEMO_CREDENTIALS.user);
                return {
                    success: true,
                    token: mockToken,
                    user: DEMO_CREDENTIALS.user
                };
            }
            return { success: false, error: 'Invalid credentials' };
        }

        try {
            // Real API call
            const response = await apiClient.post<LoginResponse>('/auth/login', {
                username,
                password
            });

            if (response.data.success && response.data.token) {
                this.setToken(response.data.token);
                if (response.data.user) {
                    this.setUser(response.data.user);
                }
            }

            return response.data;
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    }

    logout(): void {
        this.removeToken();
        this.removeUser();
        // In real app, might also call API to invalidate token
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getToken(): string | null {
        return localStorage.getItem(this.AUTH_TOKEN_KEY);
    }

    private setToken(token: string): void {
        localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    }

    private removeToken(): void {
        localStorage.removeItem(this.AUTH_TOKEN_KEY);
    }

    getUser(): { id: string; name: string; email: string } | null {
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    private setUser(user: { id: string; name: string; email: string }): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    private removeUser(): void {
        localStorage.removeItem(this.USER_KEY);
    }
}

export const authService = new AuthService(); 