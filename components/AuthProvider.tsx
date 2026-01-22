"use client";
import { SessionProvider } from "next-auth/react";

/**
 * AuthProvider : Fournit le contexte d'authentification à l'ensemble
 * de l'application (Sidebar, Pages, API).
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
