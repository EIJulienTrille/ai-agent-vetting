import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/", // Protège désormais la page d'accueil (Chat)
    "/dashboard/:path*",
    "/properties/:path*",
    "/settings/:path*",
  ],
};
