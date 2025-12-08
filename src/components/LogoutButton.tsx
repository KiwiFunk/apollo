import { authClient } from '../lib/auth-client';
import Button from './Button';

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
    <Button 
      label={
                      <span className="flex items-center justify-center">
                          {/* Mobile */}
                          <span className="lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>
                          </span>
                          
                          {/* Desktop */}
                          <span className="hidden lg:inline">Logout</span>
                      </span>
                  }
      onClick={handleLogout}
      accent={false}
    />
  );
}