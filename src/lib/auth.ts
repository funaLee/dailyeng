import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // Trust host for production builds (fixes UntrustedHost error)
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials Provider (Email/Password)
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email và mật khẩu là bắt buộc");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Tìm user trong database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt", // Required when using Credentials provider
  },

  // Custom pages
  pages: {
    signIn: "/auth/signin",
    // signUp is not a standard NextAuth page, handle via custom logic
    error: "/auth/error",
  },

  // Callbacks
  callbacks: {
    // Authorized callback for middleware - handles authentication logic
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Routes that require authentication
      const isProtectedRoute = pathname.startsWith("/user");

      // Auth routes - users already logged in should be redirected away
      const isAuthRoute =
        pathname.startsWith("/auth/signin") ||
        pathname.startsWith("/auth/signup");

      // If user is on auth page and already logged in, redirect to home
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // If route is protected and user is not logged in, redirect to signin
      if (isProtectedRoute && !isLoggedIn) {
        const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
        return Response.redirect(
          new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl)
        );
      }

      // Allow the request to continue
      return true;
    },

    async jwt({ token, user, account }) {
      // Lưu user id vào token khi đăng nhập lần đầu
      if (user) {
        token.id = user.id;
      }
      // Lưu provider info nếu cần
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      // Thêm user id vào session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      // Cho phép tất cả OAuth sign-ins
      if (account?.provider !== "credentials") {
        return true;
      }

      // Với credentials, kiểm tra user tồn tại
      if (!user?.id) {
        return false;
      }

      return true;
    },
  },

  // Events (optional - for logging/analytics)
  events: {
    async signIn({ user, account }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`);
    },
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
});
