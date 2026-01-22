import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Maison Trille — Expertise Immobilière",
  description: "SaaS de qualification de prospects par IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#F9F9FB" }}>
        <AuthProvider>
          <div
            style={{
              display: "flex",
              height: "100vh",
              width: "100vw",
              overflow: "hidden",
            }}
          >
            {/* Sidebar fixe à gauche */}
            <Sidebar />

            {/* Zone de contenu dynamique à droite */}
            <main
              style={{
                flex: 1,
                overflowY: "auto",
                backgroundColor: "white",
                position: "relative",
              }}
            >
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
