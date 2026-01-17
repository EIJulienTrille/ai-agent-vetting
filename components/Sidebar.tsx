"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        backgroundColor: "#1d1d1f",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <div style={{ marginBottom: "40px" }}>
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

      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button style={navButtonStyle}>🏠 Messagerie</button>
        <button style={navButtonStyle}>📜 Historique</button>
        <button style={navButtonStyle}>👤 Mon Compte</button>
      </nav>

      <div style={{ borderTop: "1px solid #333", paddingTop: "20px" }}>
        <p style={{ fontSize: "12px", color: "#A1A1A6", marginBottom: "10px" }}>
          Connecté en tant que :
        </p>
        <p
          style={{ fontSize: "14px", fontWeight: "600", marginBottom: "20px" }}
        >
          {session?.user?.name}
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#FF3B30",
            color: "white",
            border: "none",
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

const navButtonStyle = {
  width: "100%",
  textAlign: "left" as const,
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "transparent",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "15px",
  transition: "background 0.2s",
  fontWeight: "500",
};
