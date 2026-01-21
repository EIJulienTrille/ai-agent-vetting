import { withAuth } from "next-auth/middleware";

/**
 * Middleware de sécurité Maison Trille.
 * Bloque l'accès aux routes privées si l'utilisateur n'est pas authentifié.
 */
export default withAuth({
  pages: {
    // Redirection automatique vers cette page si l'accès est refusé
    signIn: "/auth/signin",
  },
});

/**
 * Configuration du Matcher : Définit précisément les zones à protéger.
 * On sécurise le Dashboard, la gestion des Biens et les Réglages.
 */
export const config = {
  matcher: ["/dashboard/:path*", "/properties/:path*", "/settings/:path*"],
};
