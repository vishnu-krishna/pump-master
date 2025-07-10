import type { Pump } from '../types/pump.types';

// Mock pumps data matching the mockup exactly
export const DEMO_PUMPS: Pump[] = [
    {
        id: '1',
        name: 'Pump 1',
        type: 'Centrifugal',
        area: 'Murray-Darling Basin',
        location: { latitude: -34.0333, longitude: 142.1500 }, // Mildura, Victoria - irrigation district
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
        area: 'Queensland Cane Fields',
        location: { latitude: -24.8656, longitude: 152.3160 }, // Bundaberg, Queensland - sugar cane region
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
        area: 'Hunter Valley',
        location: { latitude: -32.7996, longitude: 151.1633 }, // Hunter Valley, NSW - wine region
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
        area: 'Riverina District',
        location: { latitude: -35.1269, longitude: 147.3678 }, // Wagga Wagga, NSW - Riverina region
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
        area: 'Barossa Valley',
        location: { latitude: -34.5333, longitude: 138.9500 }, // Barossa Valley, SA - wine region
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
        area: 'Ord River Scheme',
        location: { latitude: -15.7764, longitude: 128.7425 }, // Kununurra, WA - Ord irrigation area
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
        area: 'Tasmania Midlands',
        location: { latitude: -42.1167, longitude: 147.0833 }, // Campbell Town, Tasmania - farming region
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
        area: 'Margaret River',
        location: { latitude: -33.9548, longitude: 115.0665 }, // Margaret River, WA - wine region
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
        area: 'Wheatbelt WA',
        location: { latitude: -31.6333, longitude: 117.8833 }, // Northam, WA - wheat growing region
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
        area: 'Gippsland Lakes',
        location: { latitude: -37.8821, longitude: 147.9789 }, // Bairnsdale, Victoria - vegetable growing
        flowRate: 400,
        offset: 1,
        pressure: { current: 90, min: 60, max: 120 },
        status: 'Operational',
        lastUpdated: new Date().toISOString()
    }
];

// Pressure data generator for charts
export const generatePressureData = (hours: number = 24) => {
    const data = [];
    const now = new Date();

    for (let i = 0; i < hours * 4; i++) { // 4 data points per hour
        const time = new Date(now.getTime() - (hours * 4 - i) * 15 * 60 * 1000); // 15 minute intervals
        data.push({
            time: time.toISOString(),
            value: 100 + Math.random() * 80 + Math.sin(i / 10) * 20 // Simulated pressure values
        });
    }

    return data;
};

// Demo credentials
export const DEMO_CREDENTIALS = {
    username: 'demo',
    password: 'demo123',
    hint: 'Use demo/demo123 to login',
    user: {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@pumps.com'
    }
}; 