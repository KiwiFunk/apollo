import { authClient } from '../lib/auth-client';

// https://www.better-auth.com/docs/authentication/email-password#sign-out
export default function LogoutButton() {
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // On success, perform a client-side redirect to the homepage.
          window.location.href = '/';
        }
      }
    });
  };

  return (
    <button 
      onClick={handleLogout} 
      class="text-sm font-semibold text-gray-600 hover:text-indigo-600 bg-transparent border-none p-0 cursor-pointer"
    >
      Logout
    </button>
  );
}