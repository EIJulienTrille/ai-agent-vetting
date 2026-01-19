"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkStyle = (path: string) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 18px",
    borderRadius: "10px",
    textDecoration: "none",
    color: pathname === path ? "white" : "#8E8E93",
    backgroundColor: pathname === path ? "#2C2C2E" : "transparent",
    fontSize: "15px",
    fontWeight: "500",
    transition: "0.2s ease",
  });

  return (
    <div
      style={{
        width: "280px", // Largeur fixe pour éviter de couper le texte
        backgroundColor: "#1C1C1E",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        borderRight: "1px solid #2C2C2E",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            color: "white",
            fontSize: "22px",
            fontWeight: "800",
            margin: 0,
            whiteSpace: "nowrap", // Empêche le titre de passer à la ligne
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
        <Link href="/dashboard" style={linkStyle("/dashboard")}>
          📊 Historique & Leads
        </Link>
        <div style={linkStyle("/account")}>👤 Mon Compte</div>
      </nav>

      <div style={{ borderTop: "1px solid #2C2C2E", paddingTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#8E8E93",
              fontSize: "11px",
              textTransform: "uppercase",
              margin: "0 0 4px 0",
            }}
          >
            Client Connecté
          </p>
          <p
            style={{
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Julien TRILLE
          </p>
        </div>
        <button
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#FF3B30",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
