import { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
} from "@heroui/modal";
import PumpForm from './PumpForm';
import type { Pump, PumpFormData } from '../../types/pump.types';

interface EditPumpModalProps {
    isOpen: boolean;
    onClose: () => void;
    pump: Pump | null;
    onSubmit: (data: PumpFormData) => Promise<void>;
}

const EditPumpModal = ({ isOpen, onClose, pump, onSubmit }: EditPumpModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!pump) return null;

    const handleSubmit = async (data: PumpFormData) => {
        try {
            setIsSubmitting(true);
            await onSubmit(data);
            onClose();
        } catch (error) {
            // Error is handled by parent component
        } finally {
            setIsSubmitting(false);
        }
    };

    const initialData: PumpFormData = {
        name: pump.name,
        type: pump.type,
        area: pump.area,
        latitude: pump.location.latitude,
        longitude: pump.location.longitude,
        flowRate: pump.flowRate,
        offset: pump.offset,
        minPressure: pump.pressure.min,
        maxPressure: pump.pressure.max
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            scrollBehavior="inside"
            isDismissable={!isSubmitting}
            hideCloseButton={isSubmitting}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Edit Pump - {pump.name}
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <PumpForm
                                initialData={initialData}
                                onSubmit={handleSubmit}
                                onCancel={onClose}
                                submitLabel="Update Pump"
                                isLoading={isSubmitting}
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default EditPumpModal; 