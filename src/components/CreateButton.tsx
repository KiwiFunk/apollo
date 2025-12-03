import { setCreateModalOpen } from '../stores/notesStore';
import Button from './Button';

export default function CreateButton() {
    return (
        <Button
            label="Create Note"
            accent={true}
            onClick={() => setCreateModalOpen(true)}
        />
    );
}