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
    if (!pump) return null;

    const handleSubmit = async (data: PumpFormData) => {
        await onSubmit(data);
        onClose();
    };

    // Convert pump data to form data format
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
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Edit Pump: {pump.name}
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <PumpForm
                                initialData={initialData}
                                onSubmit={handleSubmit}
                                onCancel={onClose}
                                submitLabel="Update Pump"
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default EditPumpModal; 