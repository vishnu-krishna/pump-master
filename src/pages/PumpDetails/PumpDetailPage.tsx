import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';
import { ArrowLeft } from 'lucide-react';
import { pumpService } from 'src/services/pumpService.ts';
import type { Pump } from 'src/types/pump.types.ts';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Spinner from 'src/components/common/Spinner.tsx';
import StatusBadge from 'src/components/common/StatusBadge.tsx';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Generate mock pressure data for 24 hours
const generatePressureData = (minPressure: number, maxPressure: number, currentPressure: number) => {
    const data = [];
    const hours = 24;
    const now = new Date();

    for (let i = hours; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const timeStr = format(time, 'HH:00');

        // Generate realistic pressure fluctuation
        const range = maxPressure - minPressure;
        const variation = range * 0.3; // 30% variation
        const baseValue = currentPressure;
        const randomVariation = (Math.random() - 0.5) * variation;
        const pressure = Math.max(minPressure, Math.min(maxPressure, baseValue + randomVariation));

        data.push({
            time: timeStr,
            pressure: Math.round(pressure)
        });
    }

    return data;
};

const PumpDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pump, setPump] = useState<Pump | null>(null);
    const [loading, setLoading] = useState(true);
    const [pressureData, setPressureData] = useState<any[]>([]);

    useEffect(() => {
        const loadPump = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await pumpService.getById(id);
                setPump(data);

                // Generate pressure data
                if (data) {
                    const chartData = generatePressureData(
                        data.pressure.min,
                        data.pressure.max,
                        data.pressure.current
                    );
                    setPressureData(chartData);
                }
            } catch (error) {
                console.error('Failed to load pump:', error);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        loadPump();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spinner size="lg" label="Loading pump details..." />
            </div>
        );
    }

    if (!pump) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Pump Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The pump you're looking for doesn't exist or has been removed.
                    </p>
                    <Button
                        color="primary"
                        onPress={() => navigate('/dashboard')}
                        className="w-full"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 page-container">
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <Button
                        variant="light"
                        startContent={<ArrowLeft className="w-4 h-4" />}
                        onPress={() => navigate('/dashboard')}
                        className="transition-all duration-200 hover:translate-x-[-2px]"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <h1 className="text-3xl font-bold">{pump.name}</h1>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Pump ID</p>
                            <p className="font-semibold">{pump.id}</p>
                            <p className="text-sm text-gray-600 mt-2">Status</p>
                            <div className="mt-1">
                                <StatusBadge status={pump.status} />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Last Updated</p>
                            <p className="font-semibold">{format(new Date(pump.lastUpdated), 'yyyy-MM-dd HH:mm')}</p>
                        </div>
                    </div>

                    {/* Attributes */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Attributes</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Type</p>
                                <p className="font-medium">{pump.type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Area/Block</p>
                                <p className="font-medium">{pump.area}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Location (lat/lon)</p>
                                <p className="font-medium">
                                    {Math.abs(pump.location.latitude).toFixed(4)}° {pump.location.latitude < 0 ? 'S' : 'N'}, {Math.abs(pump.location.longitude).toFixed(4)}° {pump.location.longitude < 0 ? 'W' : 'E'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Flow Rate</p>
                                <p className="font-medium">{pump.flowRate} GPM</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Offset</p>
                                <p className="font-medium">{pump.offset} sec</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pressure (Current | Min | Max)</p>
                                <p className="font-medium">
                                    {pump.pressure.current} psi | {pump.pressure.min} psi | {pump.pressure.max} psi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Map</h2>
                        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
                            <MapContainer
                                center={[pump.location.latitude, pump.location.longitude]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={false}
                                doubleClickZoom={false}
                                dragging={false}
                                zoomControl={false}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[pump.location.latitude, pump.location.longitude]} />
                            </MapContainer>
                        </div>
                    </div>

                    {/* Pressure Chart */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Pressure Over Time</h2>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{pump.pressure.current} PSI</span>
                                <span className="text-green-600 ml-2">Last 24 Hours +5%</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={pressureData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px' }}
                                        domain={[pump.pressure.min - 10, pump.pressure.max + 10]}
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="pressure"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PumpDetailPage; 