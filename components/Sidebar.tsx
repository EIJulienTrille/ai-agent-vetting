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
    padding: "14px 20px",
    borderRadius: "12px",
    textDecoration: "none",
    color: pathname === path ? "white" : "#8E8E93",
    backgroundColor: pathname === path ? "#2C2C2E" : "transparent",
    fontSize: "15px",
    fontWeight: "600",
    transition: "0.2s ease",
  });

  return (
    <div
      style={{
        width: "280px", // Largeur fixe pour protéger le titre
        minWidth: "280px",
        backgroundColor: "#1C1C1E",
        display: "flex",
        flexDirection: "column",
        padding: "30px 20px",
        boxSizing: "border-box",
        borderRight: "1px solid #2C2C2E",
      }}
    >
      <div style={{ marginBottom: "50px" }}>
        <h1
          style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "900",
            margin: 0,
            whiteSpace: "nowrap", // Empêche de couper le titre
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
      </nav>

      <div style={{ borderTop: "1px solid #2C2C2E", paddingTop: "25px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              color: "#8E8E93",
              fontSize: "11px",
              textTransform: "uppercase",
              margin: "0 0 5px 0",
            }}
          >
            Client Connecté
          </p>
          <p
            style={{
              color: "white",
              fontSize: "15px",
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
            padding: "15px",
            backgroundColor: "#FF3B30",
            color: "white",
            border: "none",
            borderRadius: "12px",
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
