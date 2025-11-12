import { auth } from "./lib/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    
    // Hand the request to Better Auth to get the session.
    const session = await auth.api.getSession({
        headers: context.request.headers,
    });

    // The session object contains the user, so we can derive the user from it.
    const user = session?.user ?? null;

    // Attach the session and user data to `context.locals`.
    context.locals.session = session;
    context.locals.user = session?.user ?? null;

    // Continue to the requested page.
    return next();
});