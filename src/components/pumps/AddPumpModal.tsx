import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
} from "@heroui/modal";
import PumpForm from './PumpForm';
import type { PumpFormData } from '../../types/pump.types';

interface AddPumpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PumpFormData) => Promise<void>;
}

const AddPumpModal = ({ isOpen, onClose, onSubmit }: AddPumpModalProps) => {
    const handleSubmit = async (data: PumpFormData) => {
        await onSubmit(data);
        onClose();
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
                            Add New Pump
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <PumpForm
                                onSubmit={handleSubmit}
                                onCancel={onClose}
                                submitLabel="Add Pump"
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddPumpModal; 