import { setCreateModalOpen } from '../stores/uiStore';
import Button from './Button';

export default function CreateButton() {
    return (
        <Button
            label={
                <span className="flex items-center justify-center">
                    {/* Mobile */}
                    <span className="lg:hidden">Create</span>
                    
                    {/* Desktop */}
                    <span className="hidden lg:inline">Create Note</span>
                </span>
            }
            accent={true}
            onClick={() => setCreateModalOpen(true)}
        />
    );
}