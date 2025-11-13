import { createAuthClient } from "better-auth/client";

// Create single authClient instance for the app
export const authClient = createAuthClient();

// Destructure and export signIn and signOut methods for easy use in components
export const { signIn, signUp, useSession, signOut } = authClient;