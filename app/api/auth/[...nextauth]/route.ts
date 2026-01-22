import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

/**
 * Configuration NextAuth dynamique connectée à Neon.
 * Remplace les identifiants statiques par une vérification en base de données.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Maison Trille",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "agent@maison-trille.com",
        },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Identifiants manquants");
        }

        const sql = neon(process.env.DATABASE_URL || "");

        // 1. Recherche de l'utilisateur dans la table 'users' de Neon
        const users = await sql`
          SELECT * FROM users WHERE email = ${credentials.email} LIMIT 1
        `;
        const user = users[0];

        // 2. Si l'utilisateur n'existe pas
        if (!user) {
          throw new Error("Aucun utilisateur trouvé avec cet email");
        }

        // 3. Vérification du mot de passe haché
        const isPasswordRoute = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordRoute) {
          throw new Error("Mot de passe incorrect");
        }

        // 4. Retourne l'utilisateur pour créer la session
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin", // Redirection vers votre page de connexion personnalisée
  },
  callbacks: {
    // Permet d'ajouter l'ID de l'utilisateur dans le token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Permet d'accéder à l'ID de l'utilisateur dans la session côté client
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
