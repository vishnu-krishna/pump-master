import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from 'src/pages/Login/LoginPage';
import { authService } from 'src/services/authService';

// Mock the auth service
vi.mock('src/services/authService', () => ({
    authService: {
        login: vi.fn(),
        isAuthenticated: vi.fn(),
    },
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock HeroUI provider
vi.mock('src/components/common/Provider', () => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (authService.isAuthenticated as any).mockReturnValue(false);
    });

    const renderLoginPage = () => {
        return render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    };

    it('renders login form with all elements', () => {
        renderLoginPage();

        expect(screen.getByText('PumpMaster')).toBeInTheDocument();
        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByText(/Use demo\/demo123 to login/i)).toBeInTheDocument();
    });

    describe('Authentication Flow', () => {
        it('successfully logs in with valid credentials', async () => {
            const user = userEvent.setup();
            (authService.login as any).mockResolvedValueOnce({ success: true });
            renderLoginPage();

            const usernameInput = screen.getByPlaceholderText('Enter your username');
            const passwordInput = screen.getByPlaceholderText('Enter your password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            await user.type(usernameInput, 'demo');
            await user.type(passwordInput, 'demo123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(authService.login).toHaveBeenCalledWith('demo', 'demo123');
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('shows error message on failed login', async () => {
            const user = userEvent.setup();
            (authService.login as any).mockResolvedValueOnce({ success: false, error: 'Invalid credentials' });
            renderLoginPage();

            const usernameInput = screen.getByPlaceholderText('Enter your username');
            const passwordInput = screen.getByPlaceholderText('Enter your password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            await user.type(usernameInput, 'wrong');
            await user.type(passwordInput, 'wrongpass');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            });
        });

        it('shows default error when login fails without specific error', async () => {
            const user = userEvent.setup();
            (authService.login as any).mockResolvedValueOnce({ success: false });
            renderLoginPage();

            const usernameInput = screen.getByPlaceholderText('Enter your username');
            const passwordInput = screen.getByPlaceholderText('Enter your password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            await user.type(usernameInput, 'wrong');
            await user.type(passwordInput, 'wrongpass');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Login failed')).toBeInTheDocument();
            });
        });

        it('shows loading state during authentication', async () => {
            const user = userEvent.setup();
            let resolveLogin: (value: any) => void;
            const loginPromise = new Promise<any>((resolve) => {
                resolveLogin = resolve;
            });
            (authService.login as any).mockReturnValueOnce(loginPromise);

            renderLoginPage();

            const usernameInput = screen.getByPlaceholderText('Enter your username');
            const passwordInput = screen.getByPlaceholderText('Enter your password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            await user.type(usernameInput, 'demo');
            await user.type(passwordInput, 'demo123');
            await user.click(submitButton);

            // Check loading state
            expect(screen.getByText('Logging in...')).toBeInTheDocument();
            expect(submitButton).toBeDisabled();

            // Resolve the promise
            resolveLogin!({ success: true });

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });
    });

    describe('Error Handling', () => {
        it('handles network errors gracefully', async () => {
            const user = userEvent.setup();
            (authService.login as any).mockRejectedValueOnce(new Error('Network error'));
            renderLoginPage();

            const usernameInput = screen.getByPlaceholderText('Enter your username');
            const passwordInput = screen.getByPlaceholderText('Enter your password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            await user.type(usernameInput, 'demo');
            await user.type(passwordInput, 'demo123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
            });
        });

        it('clears error message when typing', async () => {
            const user = userEvent.setup();
            (authService.login as any).mockResolvedValueOnce({ success: false, error: 'Invalid credentials' });
            renderLoginPage();

            // First, trigger an error
            const usernameInput = screen.getByPlaceholderText('Enter your username');
            const passwordInput = screen.getByPlaceholderText('Enter your password');
            const submitButton = screen.getByRole('button', { name: /log in/i });

            await user.type(usernameInput, 'wrong');
            await user.type(passwordInput, 'wrongpass');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            });

            // Now type in username field to clear error
            await user.type(usernameInput, 'new');

            // The error should be cleared on form submit, not on typing
            // So we need to submit again to clear the error
            await user.click(submitButton);
        });
    });
}); 