import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Acceso LÍA",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ACCESO DIRECTO PARA PRUEBAS SIN BASE DE DATOS
        if (credentials?.email === "admin@lia.com" && credentials?.password === "lia2026") {
          return {
            id: "1",
            name: "Administrador LÍA",
            email: "admin@lia.com",
            role: "admin",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET || "LIA_SUPER_SECRET_KEY_PRO_MAX_VERSION_2026",
  trustHost: true, // Importante para despliegues en Vercel con Proxies
});
