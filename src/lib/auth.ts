import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";

export const auth = betterAuth({

    // Connect Better Auth to Drizzle ORM for DB connection
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),

    // Basic Email/Password
    emailAndPassword: {
        enabled: true,
    },

    // oAuth Providers (Set Up Later)

    /*
    socialProviders: { 
        github: { 
        clientId: process.env.GITHUB_CLIENT_ID as string, 
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
    }, 
    */
});