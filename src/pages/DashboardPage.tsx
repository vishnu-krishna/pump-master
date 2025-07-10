import { authService } from '../services/authService';

const DashboardPage = () => {
    const user = authService.getCurrentUser();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Welcome, {user?.name || 'User'}</span>
                            <button
                                onClick={() => authService.logout()}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4">Dashboard Content</h2>
                    <p className="text-gray-600">
                        Login successful! This is a temporary dashboard page.
                        The pump table will be implemented in the next step.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 