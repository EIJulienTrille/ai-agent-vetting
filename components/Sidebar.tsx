"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

/**
 * Sidebar dynamique : Affiche les menus de navigation et les informations
 * de l'utilisateur connecté via la session NextAuth.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession(); // Récupération de la session active

  const linkStyle = (path: string) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 20px",
    borderRadius: "12px",
    textDecoration: "none",
    color: pathname === path ? "white" : "#8E8E93",
    backgroundColor: pathname === path ? "#2C2C2E" : "transparent",
    fontSize: "15px",
    fontWeight: "600",
    transition: "0.2s",
  });

  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        backgroundColor: "#1C1C1E",
        display: "flex",
        flexDirection: "column",
        padding: "30px 20px",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "50px" }}>
        <h1
          style={{
            color: "white",
            fontSize: "22px",
            fontWeight: "900",
            letterSpacing: "-0.02em",
          }}
        >
          MAISON TRILLE
        </h1>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
        }}
      >
        <Link href="/" style={linkStyle("/")}>
          🏠 Messagerie
        </Link>
        <Link href="/properties" style={linkStyle("/properties")}>
          🏢 Mes Mandats
        </Link>
        <Link href="/dashboard" style={linkStyle("/dashboard")}>
          📊 Historique & Leads
        </Link>
        <Link href="/settings" style={linkStyle("/settings")}>
          ⚙️ Configuration
        </Link>
      </nav>

      {/* Section Utilisateur Connecté (Dynamique) */}
      <div
        style={{
          borderTop: "1px solid #2C2C2E",
          paddingTop: "25px",
          marginTop: "auto",
        }}
      >
        <p
          style={{
            color: "#8E8E93",
            fontSize: "11px",
            textTransform: "uppercase",
            margin: "0 0 5px 0",
            letterSpacing: "0.05em",
          }}
        >
          Agent Connecté
        </p>
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            {session?.user?.name || "Chargement..."}
          </p>
          <p style={{ color: "#8E8E93", fontSize: "12px", margin: 0 }}>
            {session?.user?.email || ""}
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#2C2C2E",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#FF3B30")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#2C2C2E")
          }
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
