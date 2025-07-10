import { Chip } from '@heroui/chip';
import type { PumpStatus } from '../../types/pump.types';

interface StatusBadgeProps {
    status: PumpStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getStatusColor = () => {
        switch (status) {
            case 'Operational':
                return 'success';
            case 'Warning':
                return 'warning';
            case 'Error':
                return 'danger';
            case 'Maintenance':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'Operational':
                return '✓';
            case 'Warning':
                return '!';
            case 'Error':
                return '✕';
            case 'Maintenance':
                return '🔧';
            default:
                return '';
        }
    };

    return (
        <Chip
            color={getStatusColor()}
            size="sm"
            variant="flat"
            startContent={<span className="text-xs">{getStatusIcon()}</span>}
        >
            {status}
        </Chip>
    );
};

export default StatusBadge; 