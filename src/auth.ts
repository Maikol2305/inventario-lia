import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { users } from "./lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

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

        const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string)).limit(1);

        if (!user || !user.password) return null;

        const isPasswordCorrect = await bcrypt.compare(credentials.password as string, user.password);

        if (!isPasswordCorrect) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || 'user',
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
  secret: process.env.AUTH_SECRET,
});
