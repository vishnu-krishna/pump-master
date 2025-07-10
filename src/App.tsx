import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PumpDetailPage from './pages/PumpDetailPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { authService } from './services/authService';
import { Provider } from './provider';
import { Toaster } from 'react-hot-toast';

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <ErrorBoundary>
      <Router>
        <Provider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pump/:id"
              element={
                <ProtectedRoute>
                  <PumpDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
            />
          </Routes>
        </Provider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
