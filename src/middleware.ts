import { auth } from "./lib/auth";
import { defineMiddleware } from "astro:middleware";

const PUBLIC_ROUTES = [
    '/auth',           // The sign-in/sign-up page
    '/api/auth',       // All auth API endpoints (sign-in, sign-out, etc.)
    '/favicon.ico',    // Standard static assets
    '/assets',         // Static assets (CSS, JS bundles)
];

export const onRequest = defineMiddleware(async (context, next) => {
    
    // Hand the request to Better Auth to get the session.
    const session = await auth.api.getSession({
        headers: context.request.headers,
    });

    // Attach the user data to `context.locals`.
    const user = session?.user ?? null;
    context.locals.user = user;

    // Auth Check
    const pathname = context.url.pathname;

    // Check if the current route is included in the public list.
    const isPublicRoute = PUBLIC_ROUTES.some(path => pathname.startsWith(path));

    // If the route is NOT public AND the user is NOT logged in, redirect.
    if (!isPublicRoute && !user) {
        console.log(`[AUTH] Unauthorized access to protected route: ${pathname}. Redirecting to /auth.`);
        
        // Issue an early redirect (302) before any content rendering.
        return context.redirect('/auth');
    }

    // Continue to the requested page. (Authenticated or public route)
    return next();
});