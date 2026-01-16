"use client";
import React, { useEffect, useState } from "react";

// Définition de l'interface pour supprimer l'erreur sur conversation_data
interface VettingLog {
  id: string;
  created_at: string;
  agency_id: string;
  status: string;
  verdict: string;
  conversation_data: string; // Stocké en texte JSON dans la DB
  error_message?: string;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<VettingLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<VettingLog | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupération des données
  useEffect(() => {
    fetch("/api/admin/fetch-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur dashboard:", err);
        setLoading(false);
      });
  }, []);

  // Fonction de rendu des bulles de chat
  const renderConversation = (jsonData: string) => {
    try {
      const messages = JSON.parse(jsonData);
      return messages.map((msg: any, i: number) => (
        <div
          key={i}
          style={{
            padding: "12px 20px",
            borderRadius: "15px",
            fontSize: "14px",
            marginBottom: "10px",
            backgroundColor: msg.role === "user" ? "#F2F2F7" : "#007AFF",
            color: msg.role === "user" ? "#1d1d1f" : "white",
            alignSelf: msg.role === "user" ? "flex-start" : "flex-end",
            maxWidth: "85%",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "9px",
              opacity: 0.7,
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            {msg.role === "user" ? "PROSPECT" : "AGENT IA"}
          </p>
          {msg.content}
        </div>
      ));
    } catch (e) {
      return (
        <p style={{ color: "#FF3B30" }}>Erreur de formatage des messages.</p>
      );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F5F7",
        minHeight: "100vh",
        padding: "40px 60px",
        fontFamily: "-apple-system, sans-serif",
      }}
    >
      <header style={{ marginBottom: "40px" }}>
        {/* Correction : letterSpacing au lieu de tracking */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            letterSpacing: "-0.04em",
          }}
        >
          MONITORING
        </h1>
        <p style={{ color: "#A1A1A6", fontSize: "14px" }}>
          Maison Trille — Gestion des flux d'audit IA
        </p>
      </header>

      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        {/* LISTE DES SESSIONS */}
        <div
          style={{
            flex: "1.5",
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "25px",
            }}
          >
            Sessions Récentes
          </h2>

          {loading ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#A1A1A6" }}
            >
              Chargement...
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    fontSize: "11px",
                    color: "#A1A1A6",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  <th style={{ padding: "15px 10px" }}>Date</th>
                  <th style={{ padding: "15px 10px" }}>Statut</th>
                  <th style={{ padding: "15px 10px" }}>Verdict</th>
                  <th style={{ padding: "15px 10px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderTop: "1px solid #F2F2F7" }}>
                    <td style={{ padding: "15px 10px", fontSize: "13px" }}>
                      {new Date(log.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "15px 10px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color:
                            log.status === "SUCCESS" ? "#34C759" : "#FF3B30",
                        }}
                      >
                        ● {log.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "15px 10px",
                        fontWeight: "700",
                        fontSize: "13px",
                      }}
                    >
                      {log.verdict}
                    </td>
                    <td style={{ padding: "15px 10px" }}>
                      <button
                        onClick={() => setSelectedLog(log)}
                        style={{
                          background: "#007AFF",
                          color: "white",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* DÉTAILS DE LA CONVERSATION */}
        <div
          style={{
            flex: "1",
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "30px",
            minHeight: "600px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "25px",
            }}
          >
            Historique Chat
          </h2>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {selectedLog ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {renderConversation(selectedLog.conversation_data)}
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D1D1D6",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                Sélectionnez une session
                <br />
                pour voir l'échange.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
