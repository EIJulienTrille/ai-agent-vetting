"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Utilisation de la nouvelle route renommée pour éviter le conflit Next.js
    fetch("/api/fetch-history")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement historique:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F5F5F7",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <main
        style={{
          marginLeft: "260px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          padding: "0 60px 40px 60px",
          overflowY: "auto",
        }}
      >
        {/* ESPACEUR DE SÉCURITÉ (Identique à la page principale) */}
        <div style={{ height: "100px", flexShrink: 0 }}></div>

        {/* EN-TÊTE */}
        <header style={{ flexShrink: 0, marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "900",
              color: "#1d1d1f",
              letterSpacing: "-0.05em",
              margin: 0,
            }}
          >
            Historique
          </h1>
          <p
            style={{
              color: "#8E8E93",
              fontSize: "15px",
              marginTop: "10px",
              fontWeight: "500",
            }}
          >
            Retrouvez ici tous vos rapports d'audit Maison Trille.
          </p>
        </header>

        {/* TABLEAU DES DONNÉES */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "30px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          {loading ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#8E8E93" }}
            >
              Chargement de votre historique...
            </div>
          ) : history.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "18px",
                  color: "#1d1d1f",
                  fontWeight: "600",
                }}
              >
                Aucun audit enregistré
              </p>
              <p style={{ color: "#8E8E93", marginTop: "8px" }}>
                Commencez une nouvelle session dans la messagerie.
              </p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    backgroundColor: "#F9F9FB",
                    borderBottom: "1px solid #F2F2F7",
                  }}
                >
                  <th style={tableHeaderStyle}>DATE</th>
                  <th style={tableHeaderStyle}>VERDICT</th>
                  <th style={tableHeaderStyle}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item: any) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid #F9F9FB",
                      transition: "background 0.2s",
                    }}
                  >
                    <td style={tableCellStyle}>
                      {new Date(item.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        fontWeight: "700",
                        color: "#1d1d1f",
                      }}
                    >
                      {item.verdict || "En attente"}
                    </td>
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          backgroundColor:
                            item.status === "valid" ? "#E1F8EB" : "#FFF2F2",
                          color:
                            item.status === "valid" ? "#27AE60" : "#EB5757",
                        }}
                      >
                        {item.status || "Inconnu"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

// Styles réutilisables pour le tableau
const tableHeaderStyle = {
  padding: "20px 24px",
  fontSize: "12px",
  fontWeight: "700",
  color: "#8E8E93",
  letterSpacing: "0.05em",
};

const tableCellStyle = {
  padding: "20px 24px",
  fontSize: "15px",
  color: "#424245",
};
