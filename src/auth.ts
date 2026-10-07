import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const googleConfigured = Boolean(
  process.env.CLIENT_ID_GOOGLE && process.env.CLIENT_GOOGLE_SECRET,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.CLIENT_ID_GOOGLE!,
            clientSecret: process.env.CLIENT_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        if (typeof email !== "string" || !email.trim()) return null;
        const normalized = email.trim().toLowerCase();
        return {
          id: normalized,
          email: normalized,
          name: normalized.split("@")[0] || "User",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export const isGoogleAuthConfigured = googleConfigured;
