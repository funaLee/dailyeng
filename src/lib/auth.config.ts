import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-compatible auth config (no prisma, no bcrypt)
// This is used by middleware only
export const authConfig = {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    // Authorized callback for middleware - handles authentication logic
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Routes that require authentication
      const isProtectedRoute = pathname.startsWith("/user");

      // Auth routes - users already logged in should be redirected away
      const isAuthRoute = pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup");

      // If user is on auth page and already logged in, redirect to home
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // If route is protected and user is not logged in, redirect to signin
      if (isProtectedRoute && !isLoggedIn) {
        const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
        return Response.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl));
      }

      // Allow the request to continue
      return true;
    },
  },
} satisfies NextAuthConfig;
