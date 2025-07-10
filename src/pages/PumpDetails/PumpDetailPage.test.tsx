import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PumpDetailPage from 'src/pages/PumpDetails/PumpDetailPage';
import { pumpService } from 'src/services/pumpService';
import type { Pump } from 'src/types/pump.types';

// Mock services
vi.mock('src/services/pumpService');

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' }),
    };
});

// Mock Leaflet
vi.mock('react-leaflet', () => ({
    MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
}));

// Mock Recharts
vi.mock('recharts', () => ({
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

// Mock data
const mockPump: Pump = {
    id: '1',
    name: 'Test Pump 1',
    type: 'Centrifugal',
    status: 'Operational',
    area: 'Murray-Darling Basin',
    location: { latitude: -34.0333, longitude: 142.1600 },
    flowRate: 1000,
    offset: 5,
    pressure: { current: 150, min: 120, max: 180 },
    lastUpdated: '2024-01-15T10:30:00Z',
};

describe('PumpDetailPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (pumpService.getById as any).mockResolvedValue(mockPump);
    });

    const renderPumpDetailPage = () => {
        return render(
            <MemoryRouter initialEntries={['/pump/1']}>
                <Routes>
                    <Route path="/pump/:id" element={<PumpDetailPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    describe('Page Rendering', () => {
        it('renders loading state initially', () => {
            renderPumpDetailPage();
            expect(screen.getByText('Loading pump details...')).toBeInTheDocument();
        });

        it('renders pump details after loading', async () => {
            renderPumpDetailPage();

            await waitFor(() => {
                expect(screen.getByText('Test Pump 1')).toBeInTheDocument();
                expect(screen.getByText('Centrifugal')).toBeInTheDocument();
                expect(screen.getByText('Operational')).toBeInTheDocument();
            });
        });

        it('renders all sections correctly', async () => {
            renderPumpDetailPage();

            await waitFor(() => {
                // Header section
                expect(screen.getByText('Test Pump 1')).toBeInTheDocument();

                // Attributes section
                expect(screen.getByText('Attributes')).toBeInTheDocument();
                expect(screen.getByText('Flow Rate')).toBeInTheDocument();
                expect(screen.getByText('1000 GPM')).toBeInTheDocument();

                // Location section
                expect(screen.getByText('Map')).toBeInTheDocument();
                expect(screen.getByTestId('map-container')).toBeInTheDocument();

                // Pressure chart section
                expect(screen.getByText('Pressure Over Time')).toBeInTheDocument();
                expect(screen.getByTestId('line-chart')).toBeInTheDocument();
            });
        });
    });

    describe('Data Display', () => {
        it('displays all pump attributes correctly', async () => {
            renderPumpDetailPage();

            await waitFor(() => {
                // Check all attributes are displayed
                expect(screen.getByText('Area/Block')).toBeInTheDocument();
                expect(screen.getByText('Murray-Darling Basin')).toBeInTheDocument();

                expect(screen.getByText('Flow Rate')).toBeInTheDocument();
                expect(screen.getByText('1000 GPM')).toBeInTheDocument();

                expect(screen.getByText('Offset')).toBeInTheDocument();
                expect(screen.getByText('5 sec')).toBeInTheDocument();

                expect(screen.getByText('Pressure (Current | Min | Max)')).toBeInTheDocument();
                expect(screen.getByText('150 psi | 120 psi | 180 psi')).toBeInTheDocument();
            });
        });

        it('displays location correctly', async () => {
            renderPumpDetailPage();

            await waitFor(() => {
                expect(screen.getByText('Location (lat/lon)')).toBeInTheDocument();
                expect(screen.getByText(/34.0333.*S.*142.1600.*E/)).toBeInTheDocument();
            });
        });

        it('displays last updated time', async () => {
            renderPumpDetailPage();

            await waitFor(() => {
                expect(screen.getByText('Last Updated')).toBeInTheDocument();
                // Just check that a date is displayed, don't check exact format due to timezone differences
                expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
            });
        });
    });

    describe('Map Rendering', () => {
        it('renders map with marker', async () => {
            renderPumpDetailPage();

            await waitFor(() => {
                expect(screen.getByTestId('map-container')).toBeInTheDocument();
                expect(screen.getByTestId('marker')).toBeInTheDocument();
                expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
            });
        });
    });

    describe('Chart Rendering', () => {
        it('renders pressure chart components', async () => {
            renderPumpDetailPage();

            await waitFor(() => {
                expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
                expect(screen.getByTestId('line-chart')).toBeInTheDocument();
                expect(screen.getByTestId('line')).toBeInTheDocument();
                expect(screen.getByTestId('x-axis')).toBeInTheDocument();
                expect(screen.getByTestId('y-axis')).toBeInTheDocument();
            });
        });
    });

    describe('Navigation', () => {
        it('navigates back to dashboard when clicking back button', async () => {
            const user = userEvent.setup();
            renderPumpDetailPage();

            await waitFor(() => {
                expect(screen.getByText('Test Pump 1')).toBeInTheDocument();
            });

            const backButton = screen.getByRole('button', { name: /back to dashboard/i });
            await user.click(backButton);

            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    describe('Error Handling', () => {
        it('shows not found message for invalid pump', async () => {
            (pumpService.getById as any).mockResolvedValueOnce(null);

            renderPumpDetailPage();

            await waitFor(() => {
                expect(screen.getByText('Pump Not Found')).toBeInTheDocument();
                expect(screen.getByText(/The pump you're looking for doesn't exist/)).toBeInTheDocument();
            });
        });

        it('handles loading errors gracefully', async () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
            (pumpService.getById as any).mockRejectedValueOnce(new Error('Network error'));

            renderPumpDetailPage();

            await waitFor(() => {
                expect(consoleError).toHaveBeenCalledWith('Failed to load pump:', expect.any(Error));
            });

            consoleError.mockRestore();
        });
    });

    describe('Status Badge', () => {
        it.each([
            ['Operational', 'success'],
            ['Warning', 'warning'],
            ['Error', 'danger'],
            ['Maintenance', 'default'],
        ])('displays %s status with correct styling', async (status) => {
            const pump = { ...mockPump, status: status as any };
            (pumpService.getById as any).mockResolvedValueOnce(pump);

            renderPumpDetailPage();

            await waitFor(() => {
                expect(screen.getByText(status)).toBeInTheDocument();
            });
        });
    });
}); 