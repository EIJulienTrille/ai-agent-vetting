"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Style de base pour les liens
  const linkStyle = (path: string) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    color: pathname === path ? "white" : "#8E8E93",
    backgroundColor:
      pathname === path ? "rgba(255, 255, 255, 0.1)" : "transparent",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  });

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        backgroundColor: "#1C1C1E", // Fond noir prestigieux
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        borderRight: "1px solid #2C2C2E",
      }}
    >
      {/* Logo / Titre */}
      <div style={{ marginBottom: "40px", padding: "0 10px" }}>
        <h1
          style={{
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          MAISON TRILLE
        </h1>
      </div>

      {/* Navigation principale */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        <Link href="/" style={linkStyle("/")}>
          <span style={{ fontSize: "18px" }}>🏠</span> Messagerie
        </Link>

        <Link href="/dashboard" style={linkStyle("/dashboard")}>
          <span style={{ fontSize: "18px" }}>📊</span> Historique & Leads
        </Link>

        <div style={linkStyle("/account")}>
          <span style={{ fontSize: "18px" }}>👤</span> Mon Compte
        </div>
      </nav>

      {/* Pied de la Sidebar */}
      <div style={{ borderTop: "1px solid #2C2C2E", paddingTop: "20px" }}>
        <div style={{ padding: "0 10px", marginBottom: "20px" }}>
          <p
            style={{
              color: "#8E8E93",
              fontSize: "11px",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Client Connecté
          </p>
          <p style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>
            Julien TRILLE
          </p>
        </div>

        <button
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#FF3B30", // Rouge déconnexion
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
