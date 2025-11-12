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

      // Handle Registration specific fields (Required by BetterAuth)
      const confirmPassword = (form.querySelector("#confirmPassword") as HTMLInputElement).value;
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const name = (form.querySelector("#name") as HTMLInputElement)?.value || "";

      const { data, error } = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
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
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-8">

      <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">
        {mode === "login" ? "Sign in to your account" : "Create a new account"}
      </h2>

      <form onSubmit={handleSubmit} class="flex flex-col gap-4">

        {/* Name field, only for register mode */}
        {mode === "register" && (
          <div>
            <label for="name" class="text-sm font-medium text-gray-700 sr-only">Name</label>
            <input type="text" id="name" placeholder="Your Name" class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
          </div>
        )}

        <div>
          <label for="email" class="text-sm font-medium text-gray-700 sr-only">Email</label>
          <input type="email" id="email" placeholder="Email Address" class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
        </div>

        <div>
          <label for="password" class="text-sm font-medium text-gray-700 sr-only">Password</label>
          <input type="password" id="password" placeholder="Password" class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
        </div>

        {/* Confirm Password field, only for register mode */}
        {mode === "register" && (
          <div>
            <label for="confirmPassword" class="text-sm font-medium text-gray-700 sr-only">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Confirm Password" class="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
          </div>
        )}

        <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mt-2">
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div class="text-center mt-6">
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign In"}
        </button>
      </div>

    </div>
  );
}