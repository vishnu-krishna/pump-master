import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { DEMO_CREDENTIALS } from '../utils/mockData';
import { Button } from '@heroui/button';

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authService.login(username, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4'>
            <Button>Hello</Button>
            <div className='w-full max-w-md mx-auto'>
                <div className='bg-white shadow-lg rounded-lg'>
                    {/* Main content */}
                    <div className='px-8 py-10'>
                        {/* PumpMaster heading - ensuring no clipping */}
                        <div className='mb-10'>
                            <h1 className='text-xl font-medium text-black'>PumpMaster</h1>
                        </div>

                        {/* Welcome back heading */}
                        <h2 className='text-2xl font-semibold text-center text-black mb-8'>Welcome back</h2>

                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div>
                                <label htmlFor='username' className='block text-sm font-medium text-black mb-2'>
                                    Username
                                </label>
                                <input
                                    id='username'
                                    type='text'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder='Enter your username'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-black'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor='password' className='block text-sm font-medium text-black mb-2'>
                                    Password
                                </label>
                                <input
                                    id='password'
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Enter your password'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-black'
                                    required
                                />
                            </div>

                            {error && (
                                <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
                                    {error}
                                </div>
                            )}

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                        </form>
                    </div>

                    {/* Demo hint */}
                    <div className='bg-gray-50 px-8 py-4 border-t border-gray-200 rounded-b-lg'>
                        <p className='text-xs text-gray-600 text-center'>
                            Demo: {DEMO_CREDENTIALS.hint}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 