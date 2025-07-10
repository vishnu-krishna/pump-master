import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Search, Filter, Edit, Eye, Plus, LogOut, User } from "lucide-react";
import { authService } from 'src/services/authService';
import { pumpService } from 'src/services/pumpService';
import type { Pump, PumpFormData } from 'src/types/pump.types';
import AddPumpModal from 'src/components/pumps/AddPumpModal';
import EditPumpModal from 'src/components/pumps/EditPumpModal';
import Spinner from 'src/components/common/Spinner';
import StatusBadge from 'src/components/common/StatusBadge';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [pumps, setPumps] = useState<Pump[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPump, setEditingPump] = useState<Pump | null>(null);
    const user = authService.getUser();

    // Load pumps on component mount
    useEffect(() => {
        const loadPumps = async () => {
            try {
                setLoading(true);
                const data = await pumpService.getAll();
                setPumps(data);
            } catch (error) {
                console.error('Failed to load pumps:', error);
                toast.error('Failed to load pumps');
            } finally {
                setLoading(false);
            }
        };

        loadPumps();
    }, []);

    // Filter and search pumps
    const filteredPumps = useMemo(() => {
        let filtered = pumps;

        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(pump => pump.type === filterType);
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(pump =>
                pump.name.toLowerCase().includes(query) ||
                pump.area.toLowerCase().includes(query) ||
                pump.type.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [pumps, searchQuery, filterType]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleRowClick = (pumpId: string) => {
        navigate(`/pump/${pumpId}`);
    };

    const handleEdit = (pump: Pump) => {
        setEditingPump(pump);
    };

    const handleView = (pumpId: string) => {
        navigate(`/pump/${pumpId}`);
    };

    const handleAddPump = async (data: PumpFormData) => {
        try {
            const newPump = await pumpService.create(data);
            setPumps([...pumps, newPump]);
            toast.success('Pump added successfully');
        } catch (error) {
            console.error('Failed to add pump:', error);
            toast.error('Failed to add pump');
            throw error;
        }
    };

    const handleUpdatePump = async (data: PumpFormData) => {
        if (!editingPump) return;

        try {
            const updatedPump = await pumpService.update(editingPump.id, data);
            if (updatedPump) {
                setPumps(pumps.map(p => p.id === updatedPump.id ? updatedPump : p));
                toast.success('Pump updated successfully');
            }
        } catch (error) {
            console.error('Failed to update pump:', error);
            toast.error('Failed to update pump');
            throw error;
        }
    };

    const columns = [
        { name: "Pump Name", uid: "name" },
        { name: "Type", uid: "type" },
        { name: "Status", uid: "status" },
        { name: "Area/Block", uid: "area" },
        { name: "Latitude", uid: "latitude" },
        { name: "Longitude", uid: "longitude" },
        { name: "Flow Rate", uid: "flowRate" },
        { name: "Offset", uid: "offset" },
        { name: "Current Pressure", uid: "pressure" },
        { name: "Min Pressure", uid: "minPressure" },
        { name: "Max Pressure", uid: "maxPressure" },
        { name: "Actions", uid: "actions" },
    ];

    const renderCell = (pump: Pump, columnKey: React.Key) => {
        switch (columnKey) {
            case "name":
                return <span className='font-medium'>{pump.name}</span>;
            case "type":
                return pump.type;
            case "area":
                return pump.area;
            case "status":
                return <StatusBadge status={pump.status} />;
            case "flowRate":
                return `${pump.flowRate} GPM`;
            case "offset":
                return `${pump.offset} sec`;
            case "pressure":
                return `${pump.pressure.current} psi`;
            case "minPressure":
                return `${pump.pressure.min} psi`;
            case "maxPressure":
                return `${pump.pressure.max} psi`;
            case "latitude":
                return pump.location.latitude.toFixed(4);
            case "longitude":
                return pump.location.longitude.toFixed(4);
            case "actions":
                return (
                    <div
                        className='flex gap-2'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            isIconOnly
                            size='sm'
                            variant='light'
                            onPress={() => handleEdit(pump)}
                        >
                            <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                            isIconOnly
                            size='sm'
                            variant='light'
                            onPress={() => handleView(pump.id)}
                        >
                            <Eye className='w-4 h-4' />
                        </Button>
                    </div>
                );
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <Spinner size='lg' label='Loading pumps...' />
            </div>
        );
    }

    return (
        <>
            {/* Navbar */}
            <div className='bg-white shadow-sm border-b border-gray-200 w-full'>
                <div className='w-full px-[30px] flex justify-between items-center h-16'>
                    <span className='font-semibold text-xl'>PumpMaster</span>
                    <Dropdown placement='bottom-end'>
                        <DropdownTrigger>
                            <Button
                                isIconOnly
                                variant='bordered'
                                radius='full'
                                className='w-10 h-10'
                            >
                                <User className='w-5 h-5' />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label='User menu'>
                            <DropdownItem key='profile' className='h-14 gap-2'>
                                <p className='font-semibold'>{user?.name || 'John Doe'}</p>
                                <p className='text-sm text-gray-500'>{user?.email || 'john.doe@pumps.com'}</p>
                            </DropdownItem>
                            <DropdownItem
                                key='logout'
                                startContent={<LogOut className='w-4 h-4' />}
                                onPress={handleLogout}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div className='min-h-screen bg-gray-50 page-container'>
                {/* Main Content */}
                <div className='container mx-auto px-4 py-8'>
                    {/* Header */}
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-2xl font-semibold'>Pumps</h1>
                        <Button
                            color='primary'
                            startContent={<Plus className='w-4 h-4' />}
                            onPress={() => setShowAddModal(true)}
                        >
                            New Pump
                        </Button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className='flex gap-4 mb-6'>
                        <Input
                            placeholder='Search pumps...'
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            startContent={<Search className='w-4 h-4 text-gray-400' />}
                            className='max-w-xs'
                        />

                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant='bordered' startContent={<Filter className='w-4 h-4' />}>
                                    Filter
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label='Filter options'
                                onAction={(key) => setFilterType(key as string)}
                            >
                                <DropdownItem key='all'>All Types</DropdownItem>
                                <DropdownItem key='Centrifugal'>Centrifugal</DropdownItem>
                                <DropdownItem key='Submersible'>Submersible</DropdownItem>
                                <DropdownItem key='Diaphragm'>Diaphragm</DropdownItem>
                                <DropdownItem key='Rotary'>Rotary</DropdownItem>
                                <DropdownItem key='Peristaltic'>Peristaltic</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    {/* Results Summary */}
                    {(searchQuery || filterType !== 'all') && (
                        <div className='mb-4 text-sm text-gray-600'>
                            Showing {filteredPumps.length} of {pumps.length} pumps
                            {searchQuery && <span> matching "{searchQuery}"</span>}
                            {filterType !== 'all' && <span> of type {filterType}</span>}
                        </div>
                    )}

                    {/* Pumps Table */}
                    {filteredPumps.length === 0 ? (
                        <div className='bg-white rounded-lg border border-gray-200 p-16 text-center'>
                            <div className='max-w-sm mx-auto'>
                                <svg className='w-12 h-12 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                                </svg>
                                <h3 className='text-lg font-medium text-gray-900 mb-2'>No pumps found</h3>
                                <p className='text-gray-500'>
                                    {searchQuery || filterType !== 'all'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Get started by adding your first pump'}
                                </p>
                                {!searchQuery && filterType === 'all' && (
                                    <Button
                                        color='primary'
                                        className='mt-4'
                                        startContent={<Plus className='w-4 h-4' />}
                                        onPress={() => setShowAddModal(true)}
                                    >
                                        Add First Pump
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Table
                            aria-label='Pumps table'
                            className='w-full'
                            onRowAction={(key) => handleRowClick(key as string)}
                        >
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn key={column.uid}>
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={filteredPumps}>
                                {(pump) => (
                                    <TableRow
                                        key={pump.id}
                                        className='cursor-pointer hover:bg-gray-50 transition-colors duration-150'
                                    >
                                        {(columnKey) => <TableCell>{renderCell(pump, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Modals */}
                <AddPumpModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddPump}
                />

                <EditPumpModal
                    isOpen={!!editingPump}
                    onClose={() => setEditingPump(null)}
                    pump={editingPump}
                    onSubmit={handleUpdatePump}
                />
            </div>
        </>

    );
};

export default DashboardPage; 