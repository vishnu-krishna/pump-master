import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { authService } from 'src/services/authService.ts';
import { DEMO_CREDENTIALS } from 'src/utils/mockData.ts';

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
                            <Input
                                label='Username'
                                labelPlacement='outside'
                                placeholder='Enter your username'
                                value={username}
                                onValueChange={setUsername}
                                variant='bordered'
                                className={'pb-5'}
                                classNames={{
                                    label: "text-sm font-medium text-black mb-2",
                                    input: "placeholder-gray-400",
                                    inputWrapper: "border-gray-300 hover:border-gray-400 focus-within:!border-blue-500"
                                }}
                                isRequired
                            />

                            <Input
                                label='Password'
                                labelPlacement='outside'
                                placeholder='Enter your password'
                                type='password'
                                value={password}
                                onValueChange={setPassword}
                                variant='bordered'
                                classNames={{
                                    label: "text-sm font-medium text-black mb-2",
                                    input: "placeholder-gray-400",
                                    inputWrapper: "border-gray-300 hover:border-gray-400 focus-within:!border-blue-500"
                                }}
                                isRequired
                            />

                            {error && (
                                <div className='text-sm text-red-600 bg-red-50 p-3 rounded-md'>
                                    {error}
                                </div>
                            )}

                            <Button
                                type='submit'
                                className='w-full'
                                color='primary'
                                isLoading={loading}
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </Button>
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