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
        padding: "24px",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        boxSizing: "border-box", // CRUCIAL : inclut le padding dans le calcul de la hauteur
      }}
    >
      {/* SECTION HAUT : TITRE */}
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

      {/* SECTION MILIEU : NAVIGATION */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <button style={navButtonStyle}>🏠 Messagerie</button>
        <button style={navButtonStyle}>📜 Historique</button>
        <button style={navButtonStyle}>👤 Mon Compte</button>
      </nav>

      {/* SECTION BAS : UTILISATEUR ET DÉCONNEXION */}
      <div
        style={{
          borderTop: "1px solid #333",
          paddingTop: "20px",
          marginTop: "auto", // Pousse ce bloc tout en bas
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ overflow: "hidden" }}>
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
            transition: "background 0.2s",
            fontSize: "14px",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#E03126")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#FF3B30")
          }
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
  borderRadius: "10px",
  backgroundColor: "transparent",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "background 0.2s",
};
