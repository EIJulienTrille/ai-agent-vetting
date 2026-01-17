"use client";
import React, { useEffect, useState } from "react";

interface VettingLog {
  id: string;
  created_at: string;
  status: string;
  verdict: string;
  conversation_data: any;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<VettingLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<VettingLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const fetchLogs = () => {
    fetch("/api/admin/fetch-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
        setLoading(false);
      });
  };

  const deleteLog = async (id: string) => {
    if (!confirm("Supprimer définitivement cette session ?")) return;
    const res = await fetch("/api/admin/delete-log", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setLogs(logs.filter((l) => l.id !== id));
      if (selectedLog?.id === id) setSelectedLog(null);
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Statut", "Verdict"].join(",");
    const rows = logs.map((log) =>
      [
        new Date(log.created_at).toLocaleDateString("fr-FR"),
        log.status,
        log.verdict,
      ].join(",")
    );
    const csvContent = "\uFEFF" + headers + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-audit-maison-trille.csv`;
    a.click();
  };

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput }),
    });
    if (res.ok) {
      setIsAuthenticated(true);
      fetchLogs();
    }
  };

  // --- LOGIQUE DE RENDU CORRIGÉE (Re-détection du format) ---
  const renderConversation = (data: any) => {
    try {
      // Détecte si c'est du texte JSON ou déjà un objet (Postgres client Vercel)
      const messages = typeof data === "string" ? JSON.parse(data) : data;

      if (!Array.isArray(messages))
        return <p style={{ color: "#A1A1A6" }}>Aucun message trouvé.</p>;

      return messages.map((msg: any, i: number) => (
        <div
          key={i}
          style={{
            padding: "12px 18px",
            borderRadius: "18px",
            marginBottom: "12px",
            fontSize: "13px",
            lineHeight: "1.4",
            backgroundColor: msg.role === "user" ? "#F2F2F7" : "#007AFF",
            color: msg.role === "user" ? "#1c1c1e" : "white",
            alignSelf: msg.role === "user" ? "flex-start" : "flex-end",
            maxWidth: "85%",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            wordBreak: "break-word",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              fontWeight: "bold",
              display: "block",
              marginBottom: "4px",
              opacity: 0.8,
            }}
          >
            {msg.role === "user" ? "PROSPECT" : "AGENT IA"}
          </span>
          {msg.content}
        </div>
      ));
    } catch (e) {
      return (
        <p style={{ color: "#FF3B30" }}>Erreur de lecture de l'historique.</p>
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          backgroundColor: "#F5F5F7",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "30px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
            width: "350px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "25px",
            }}
          >
            Administration
          </h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #E5E5E7",
              width: "100%",
              marginBottom: "20px",
              outline: "none",
              textAlign: "center",
            }}
            placeholder="Mot de passe"
          />
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#007AFF",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F5F5F7",
        minHeight: "100vh",
        padding: "40px 60px",
        fontFamily: "-apple-system, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
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
            Maison Trille — Gestion des flux
          </p>
        </div>
        <button
          onClick={exportToCSV}
          style={{
            backgroundColor: "#34C759",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Exporter CSV
        </button>
      </header>

      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        {/* TABLEAU DES LOGS */}
        <div
          style={{
            flex: 1.5,
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>Sessions Récentes</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  color: "#A1A1A6",
                  fontSize: "11px",
                  textTransform: "uppercase",
                }}
              >
                <th style={{ padding: "10px" }}>DATE</th>
                <th style={{ padding: "10px" }}>STATUT</th>
                <th style={{ padding: "10px" }}>VERDICT</th>
                <th style={{ padding: "10px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderTop: "1px solid #F2F2F7" }}>
                  <td style={{ padding: "15px 10px", fontSize: "13px" }}>
                    {new Date(log.created_at).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      padding: "15px 10px",
                      color: log.status === "SUCCESS" ? "#34C759" : "#FF3B30",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    ● {log.status}
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
                        marginRight: "8px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => deleteLog(log.id)}
                      style={{
                        background: "#FF3B30",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AFFICHAGE CHAT */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "30px",
            minHeight: "600px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          }}
        >
          <h3 style={{ marginBottom: "25px" }}>Historique du Chat</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {selectedLog ? (
              renderConversation(selectedLog.conversation_data)
            ) : (
              <p
                style={{
                  color: "#D1D1D6",
                  textAlign: "center",
                  marginTop: "100px",
                }}
              >
                Cliquez sur "Détails" pour voir la conversation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
