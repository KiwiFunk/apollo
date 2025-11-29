import { useState } from 'preact/hooks';
import { removeNote } from '../stores/notesStore'; // Import the Nanostore mutator

interface DeleteButtonProps {
    slug: string;
    // Optional: Where to redirect the user after a successful delete
    redirectUrl?: string; 
    // Optional: Allows custom button content (e.g., just an icon)
    children?: preact.ComponentChildren; 
}

export default function DeleteNoteButton({ slug, redirectUrl = '/', children = 'Delete Note' }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the note with slug: ${slug}? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);

        try {
            // Send the DELETE request
            const response = await fetch(`/api/notes/${slug}`, {
                method: 'DELETE',
                credentials: 'include', // Ensure session cookie is sent for authorization
            });
            
            // Handle Successful deletion
            if (response.status === 204) {
        
                console.log(`Note ${slug} deleted successfully.`);

                // Update the Nanostore instantly
                removeNote(slug); 
                
                // Redirect the user if they are currently viewing the deleted note
                if (window.location.pathname === `/notes/${slug}`) {
                    window.location.href = redirectUrl; 
                }
                
            } else if (response.status === 403) {
                alert("Authorization Failed: You do not own this note.");
            } else if (response.status === 404) {
                alert("Error: Note not found.");
            } 
            else {
                alert(`Deletion failed. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("API call error:", error);
            alert("A network error occurred during deletion.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 text-white font-semibold rounded transition duration-150 ${
                isDeleting 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
            }`}
        >
            {isDeleting ? 'Deleting...' : children}
        </button>
    );
}