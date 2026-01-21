import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Configuration de l'authentification
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Maison Trille Account",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "agent@maison-trille.com",
        },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Pour le MVP, nous utilisons un compte test.
        // À terme, nous vérifierons cela dans la table 'users' de Neon.
        if (
          credentials?.email === "admin@maison-trille.com" &&
          credentials?.password === "prestige2026"
        ) {
          return {
            id: "1",
            name: "Julien TRILLE",
            email: "admin@maison-trille.com",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // On va créer cette page personnalisée
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
