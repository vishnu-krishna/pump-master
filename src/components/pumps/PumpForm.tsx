import { useForm } from 'react-hook-form';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from '@heroui/dropdown';
import type { PumpFormData, PumpType } from '../../types/pump.types';

interface PumpFormProps {
    initialData?: PumpFormData;
    onSubmit: (data: PumpFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
    submitLabel?: string;
}

const PUMP_TYPES: PumpType[] = ['Centrifugal', 'Submersible', 'Diaphragm', 'Rotary', 'Peristaltic'];

const PumpForm = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    submitLabel = 'Save'
}: PumpFormProps) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<PumpFormData>({
        defaultValues: initialData || {
            name: '',
            type: 'Centrifugal',
            area: '',
            latitude: 34.0522,
            longitude: -118.2437,
            flowRate: 1000,
            offset: 5,
            minPressure: 100,
            maxPressure: 180
        }
    });

    const selectedType = watch('type');

    const onFormSubmit = (data: PumpFormData) => {
        // Convert string values to numbers
        const formData: PumpFormData = {
            ...data,
            latitude: parseFloat(data.latitude.toString()),
            longitude: parseFloat(data.longitude.toString()),
            flowRate: parseInt(data.flowRate.toString()),
            offset: parseInt(data.offset.toString()),
            minPressure: parseInt(data.minPressure.toString()),
            maxPressure: parseInt(data.maxPressure.toString())
        };
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Name */}
            <Input
                label="Pump Name"
                placeholder="Enter pump name"
                {...register('name', { required: 'Pump name is required' })}
                errorMessage={errors.name?.message}
                isInvalid={!!errors.name}
                isRequired
            />

            {/* Type */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Pump Type <span className="text-red-500">*</span>
                </label>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" className="w-full justify-between">
                            {selectedType}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Pump type selection"
                        onAction={(key) => setValue('type', key as PumpType)}
                        selectedKeys={[selectedType]}
                    >
                        {PUMP_TYPES.map(type => (
                            <DropdownItem key={type}>{type}</DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>

            {/* Area/Block */}
            <Input
                label="Area/Block"
                placeholder="e.g., Area A"
                {...register('area', { required: 'Area is required' })}
                errorMessage={errors.area?.message}
                isInvalid={!!errors.area}
                isRequired
            />

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Latitude"
                    type="number"
                    step="0.0001"
                    placeholder="34.0522"
                    {...register('latitude', {
                        required: 'Latitude is required',
                        min: { value: -90, message: 'Must be between -90 and 90' },
                        max: { value: 90, message: 'Must be between -90 and 90' }
                    })}
                    errorMessage={errors.latitude?.message}
                    isInvalid={!!errors.latitude}
                    isRequired
                />
                <Input
                    label="Longitude"
                    type="number"
                    step="0.0001"
                    placeholder="-118.2437"
                    {...register('longitude', {
                        required: 'Longitude is required',
                        min: { value: -180, message: 'Must be between -180 and 180' },
                        max: { value: 180, message: 'Must be between -180 and 180' }
                    })}
                    errorMessage={errors.longitude?.message}
                    isInvalid={!!errors.longitude}
                    isRequired
                />
            </div>

            {/* Flow Rate & Offset */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Flow Rate (GPM)"
                    type="number"
                    placeholder="1000"
                    {...register('flowRate', {
                        required: 'Flow rate is required',
                        min: { value: 0, message: 'Must be positive' }
                    })}
                    errorMessage={errors.flowRate?.message}
                    isInvalid={!!errors.flowRate}
                    isRequired
                />
                <Input
                    label="Offset (seconds)"
                    type="number"
                    placeholder="5"
                    {...register('offset', {
                        required: 'Offset is required',
                        min: { value: 0, message: 'Must be positive' }
                    })}
                    errorMessage={errors.offset?.message}
                    isInvalid={!!errors.offset}
                    isRequired
                />
            </div>

            {/* Pressure Range */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Pressure Range (PSI)
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Min Pressure"
                        type="number"
                        placeholder="100"
                        {...register('minPressure', {
                            required: 'Min pressure is required',
                            min: { value: 0, message: 'Must be positive' },
                            validate: (value, formValues) =>
                                parseInt(value.toString()) < parseInt(formValues.maxPressure.toString()) || 'Must be less than max pressure'
                        })}
                        errorMessage={errors.minPressure?.message}
                        isInvalid={!!errors.minPressure}
                        isRequired
                    />
                    <Input
                        label="Max Pressure"
                        type="number"
                        placeholder="180"
                        {...register('maxPressure', {
                            required: 'Max pressure is required',
                            min: { value: 0, message: 'Must be positive' },
                            validate: (value, formValues) =>
                                parseInt(value.toString()) > parseInt(formValues.minPressure.toString()) || 'Must be greater than min pressure'
                        })}
                        errorMessage={errors.maxPressure?.message}
                        isInvalid={!!errors.maxPressure}
                        isRequired
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4">
                <Button
                    variant="light"
                    onPress={onCancel}
                    isDisabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};

export default PumpForm; 