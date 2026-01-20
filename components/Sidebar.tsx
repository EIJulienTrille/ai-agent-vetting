"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Composant Sidebar : Gère la navigation principale de l'écosystème SaaS.
 * Intègre les sections Messagerie, Gestion des Biens et Historique Leads.
 */
export default function Sidebar() {
  const pathname = usePathname();

  // Style dynamique pour les liens de navigation
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
    transition: "all 0.2s ease",
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
        boxSizing: "border-box",
        borderRight: "1px solid #2C2C2E",
        height: "100vh",
      }}
    >
      {/* Branding Maison Trille */}
      <div style={{ marginBottom: "50px" }}>
        <h1
          style={{
            color: "white",
            fontSize: "22px",
            fontWeight: "900",
            margin: 0,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
          }}
        >
          MAISON TRILLE
        </h1>
      </div>

      {/* Navigation Principale */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
        }}
      >
        <Link href="/" style={linkStyle("/")}>
          <span style={{ fontSize: "18px" }}>🏠</span> Messagerie
        </Link>

        {/* Nouvel accès à la gestion des biens immobiliers */}
        <Link href="/properties" style={linkStyle("/properties")}>
          <span style={{ fontSize: "18px" }}>🏢</span> Mes Mandats
        </Link>

        <Link href="/dashboard" style={linkStyle("/dashboard")}>
          <span style={{ fontSize: "18px" }}>📊</span> Historique & Leads
        </Link>
      </nav>

      {/* Pied de page Sidebar : Session Agent */}
      <div style={{ borderTop: "1px solid #2C2C2E", paddingTop: "25px" }}>
        <div style={{ marginBottom: "20px" }}>
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
            backgroundColor: "#FF3B30", // Couleur d'alerte iOS
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
