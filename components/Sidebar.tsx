"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import Link from "next/link"; // Import indispensable
import { usePathname } from "next/navigation"; // Pour savoir sur quelle page on est

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname(); // Récupère l'URL actuelle (ex: /history)

  // Fonction pour styliser le bouton actif
  const getButtonStyle = (path: string) => ({
    width: "100%",
    textAlign: "left" as const,
    padding: "12px 16px",
    borderRadius: "12px",
    backgroundColor: pathname === path ? "#2c2c2e" : "transparent", // Gris foncé si actif
    color: pathname === path ? "#007AFF" : "white", // Bleu si actif
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: pathname === path ? "700" : "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  });

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        backgroundColor: "#1d1d1f",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        boxSizing: "border-box",
      }}
    >
      {/* LOGO */}
      <div style={{ marginBottom: "40px", paddingLeft: "8px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
          }}
        >
          MAISON TRILLE
        </h2>
      </div>

      {/* NAVIGATION AVEC LINK */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Link href="/" style={getButtonStyle("/")}>
          <span>🏠</span> Messagerie
        </Link>

        <Link href="/history" style={getButtonStyle("/history")}>
          <span>📜</span> Historique
        </Link>

        <Link href="/account" style={getButtonStyle("/account")}>
          <span>👤</span> Mon Compte
        </Link>
      </nav>

      {/* BAS DE SIDEBAR : UTILISATEUR */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: "20px",
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ paddingLeft: "8px" }}>
          <p
            style={{
              fontSize: "11px",
              color: "#A1A1A6",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}
          >
            Client connecté
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {session?.user?.name || "Utilisateur"}
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: "#FF3B30",
            color: "white",
            border: "none",
            fontWeight: "700",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
