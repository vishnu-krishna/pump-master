import type { Pump } from '../types/pump.types';

// Mock pumps data matching the mockup exactly
export const DEMO_PUMPS: Pump[] = [
    {
        id: '1',
        name: 'Pump 1',
        type: 'Centrifugal',
        area: 'Area A',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 1000,
        offset: 5,
        pressure: { current: 150, min: 120, max: 180 },
        status: 'Operational',
        lastUpdated: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Pump 2',
        type: 'Submersible',
        area: 'Area B',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 800,
        offset: 3,
        pressure: { current: 130, min: 100, max: 160 },
        status: 'Operational',
        lastUpdated: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: '3',
        name: 'Pump 3',
        type: 'Diaphragm',
        area: 'Area C',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 600,
        offset: 2,
        pressure: { current: 110, min: 80, max: 140 },
        status: 'Warning',
        lastUpdated: new Date(Date.now() - 7200000).toISOString()
    },
    {
        id: '4',
        name: 'Pump 4',
        type: 'Rotary',
        area: 'Area D',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 400,
        offset: 1,
        pressure: { current: 90, min: 60, max: 120 },
        status: 'Operational',
        lastUpdated: new Date(Date.now() - 1800000).toISOString()
    },
    {
        id: '5',
        name: 'Pump 5',
        type: 'Peristaltic',
        area: 'Area E',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 200,
        offset: 0,
        pressure: { current: 70, min: 40, max: 100 },
        status: 'Maintenance',
        lastUpdated: new Date(Date.now() - 900000).toISOString()
    },
    {
        id: '6',
        name: 'Pump 6',
        type: 'Centrifugal',
        area: 'Area F',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 1200,
        offset: 6,
        pressure: { current: 170, min: 140, max: 200 },
        status: 'Operational',
        lastUpdated: new Date(Date.now() - 600000).toISOString()
    },
    {
        id: '7',
        name: 'Pump 7',
        type: 'Submersible',
        area: 'Area G',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 1000,
        offset: 4,
        pressure: { current: 150, min: 120, max: 180 },
        status: 'Operational',
        lastUpdated: new Date(Date.now() - 300000).toISOString()
    },
    {
        id: '8',
        name: 'Pump 8',
        type: 'Diaphragm',
        area: 'Area H',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 800,
        offset: 3,
        pressure: { current: 130, min: 100, max: 160 },
        status: 'Error',
        lastUpdated: new Date(Date.now() - 150000).toISOString()
    },
    {
        id: '9',
        name: 'Pump 9',
        type: 'Rotary',
        area: 'Area I',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 600,
        offset: 2,
        pressure: { current: 110, min: 80, max: 140 },
        status: 'Operational',
        lastUpdated: new Date(Date.now() - 60000).toISOString()
    },
    {
        id: '10',
        name: 'Pump 10',
        type: 'Peristaltic',
        area: 'Area J',
        location: { latitude: 34.0522, longitude: -118.2437 },
        flowRate: 400,
        offset: 1,
        pressure: { current: 90, min: 60, max: 120 },
        status: 'Operational',
        lastUpdated: new Date().toISOString()
    }
];

// Pressure data generator for charts
export const generatePressureData = (hours: number = 24): any[] => {
    const data = [];
    const now = new Date();

    for (let i = hours; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseValue = 150;
        const variation = Math.sin(i * 0.5) * 20 + Math.random() * 10;

        data.push({
            time: time.toISOString(),
            timestamp: `${time.getHours().toString().padStart(2, '0')}:00`,
            pressure: Math.round(Math.max(100, Math.min(200, baseValue + variation)))
        });
    }

    return data;
};

// Demo credentials
export const DEMO_CREDENTIALS = {
    username: 'demo',
    password: 'demo123',
    hint: 'Use demo/demo123 to login'
}; 