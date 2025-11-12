import { signIn } from "../lib/auth-client";

export default function LoginForm() {
    
  const handleEmailLogin = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector("#email") as HTMLInputElement).value;
    const password = (form.querySelector("#password") as HTMLInputElement).value;

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
  };

  return (
    <div class="mt-8 flex flex-col items-center gap-4">
      <p class="text-gray-500">Login or create an account to continue</p>
      <form onSubmit={handleEmailLogin} class="flex flex-col gap-4 w-72">
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          class="px-4 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          class="px-4 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          class="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
