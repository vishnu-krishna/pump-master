import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from 'src/pages/Login/LoginPage';
import DashboardPage from 'src/pages/Dashboard/DashboardPage';
import PumpDetailPage from 'src/pages/PumpDetails/PumpDetailPage';
import ProtectedRoute from 'src/components/common/ProtectedRoute';
import ErrorBoundary from 'src/components/common/ErrorBoundary';
import { authService } from 'src/services/authService';
import { Provider } from 'src/provider';
import { Toaster } from 'react-hot-toast';

function App() {
    const isAuthenticated = authService.isAuthenticated();

    return (
        <ErrorBoundary>
            <Router>
                <Provider>
                    <Toaster position='top-right' />
                    <Routes>
                        <Route path='/login' element={<LoginPage />} />
                        <Route
                            path='/dashboard'
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/pump/:id'
                            element={
                                <ProtectedRoute>
                                    <PumpDetailPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/'
                            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
                        />
                    </Routes>
                </Provider>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
