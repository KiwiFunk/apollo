// Import BetterAuth functions from the instantiated Auth Client.
// https://www.better-auth.com/docs/authentication/email-password#sign-up
import { signIn, signUp } from "../lib/auth-client";
import { useState } from "preact/hooks";

export default function LoginForm() {

    // State to track if login or register mode
    const [mode, setMode] = useState<"login" | "register">("login");

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.querySelector("#email") as HTMLInputElement).value;
        const password = (form.querySelector("#password") as HTMLInputElement).value;

        if (mode === "register") {
            // Handle Registration
            const confirmPassword = (form.querySelector("#confirmPassword") as HTMLInputElement).value;
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            const { data, error } = await signUp.email({
                name: "John Doe",               // required
                email: "john.doe@example.com",  // required
                password: "password1234",       // required
                image: "https://example.com/image.png",
                callbackURL: "https://example.com/callback",
            });

            if (error) {
                alert(`Registration failed: ${error.message}`);
            } 
        } else {
            // Use the correct method 'signIn.email' as per the documentation
            const { data, error } = await signIn.email({
                email,
                password,
                // Better Auth will handle redirecting to the home page on success.
                callbackURL: "/",
            });

            // If there's an error, display it. Otherwise, do nothing
            if (error) {
                alert(`Login failed: ${error.message}`);
            }
        }
    };

    return (
    <div class="mt-8 flex flex-col items-center gap-4">
      <h2 class="text-2xl font-semibold text-gray-700">
        {mode === "login" ? "Welcome Back" : "Create an Account"}
      </h2>
      <form onSubmit={handleSubmit} class="flex flex-col gap-4 w-72">
        <input type="email" id="email" placeholder="Enter your email" class="px-4 py-2 border rounded-md" required />
        <input type="password" id="password" placeholder="Enter your password" class="px-4 py-2 border rounded-md" required />
        
        {/* Only show 'Confirm Password' field in register mode */}
        {mode === "register" && (
          <input type="password" id="confirmPassword" placeholder="Confirm your password" class="px-4 py-2 border rounded-md" required />
        )}

        <button type="submit" class="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition">
          {mode === "login" ? "Continue" : "Sign Up"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        class="text-sm text-indigo-600 hover:underline"
      >
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
      </button>
    </div>
  );
}