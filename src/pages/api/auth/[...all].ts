import { auth } from "../../../lib/auth"; // Path to Auth.ts
import type { APIRoute } from "astro";

// Important! Tell Astro endpoint is dynamic and must be run on the server for every request.
export const prerender = false;

// The 'ALL' export handles any HTTP method (GET, POST, PUT, etc.)
export const ALL: APIRoute = async ({ request }) => {
  // Handoff request to the Better Auth handler.
  // Automatically handles all auth-related API endpoints like /login, /logout, /callback, etc.
  return auth.handler(request);
};