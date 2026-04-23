import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { mockUsers } from "./lib/db/mock-data";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // AUTHENTICATION WITH MOCK DATA
        const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);

        if (!user) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET || "LIA_SUPER_SECRET_KEY_PRO_MAX_VERSION_2026_LABORATORIO_INFORMATICA_APLICADA_SECURITY_TOKEN_1234567890",
});
