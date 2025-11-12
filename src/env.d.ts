/* 
  This file is for defining global types related to the application environment.
  In this case, we are extending Astro's App.Locals interface
*/
declare namespace App {
  interface Locals {
    session: Awaited<ReturnType<typeof auth.api.getSession>> | null;
    user: Awaited<ReturnType<typeof auth.api.getSession>>["user"] | null;
  }
}
