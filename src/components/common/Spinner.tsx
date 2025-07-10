import { Spinner as HeroUISpinner } from '@heroui/spinner';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const Spinner = ({ size = 'md', label, color = 'primary' }: SpinnerProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <HeroUISpinner size={size} color={color} />
            {label && <p className="text-sm text-gray-600">{label}</p>}
        </div>
    );
};

export default Spinner; 