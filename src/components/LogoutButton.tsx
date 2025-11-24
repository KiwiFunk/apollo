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
      label="Logout"
      onClick={handleLogout}
      accent={false}
    />
  );
}