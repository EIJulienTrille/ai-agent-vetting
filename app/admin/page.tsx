"use client";
import React, { useEffect, useState } from "react";

// Interface pour sécuriser l'accès aux données
interface VettingLog {
  id: string;
  created_at: string;
  agency_id: string;
  status: string;
  verdict: string;
  conversation_data: any;
  error_message?: string;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<VettingLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<VettingLog | null>(null);
  const [loading, setLoading] = useState(true);

  // États pour la sécurité (Login)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // FONCTION DE CONNEXION (Corrigée avec les Headers JSON)
  const handleLogin = async () => {
    setLoginError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // CRUCIAL pour que le serveur lise le mot de passe
        },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();

      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        fetchLogs();
      } else {
        setLoginError(true);
      }
    } catch (err) {
      console.error("Erreur login:", err);
      setLoginError(true);
    }
  };

  // Chargement des données depuis la DB
  const fetchLogs = () => {
    fetch("/api/admin/fetch-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch:", err);
        setLoading(false);
      });
  };

  // Rendu des bulles de chat (Gère le format JSON ou Objet)
  const renderConversation = (data: any) => {
    try {
      const messages = typeof data === "string" ? JSON.parse(data) : data;
      if (!Array.isArray(messages)) return <p>Format de données invalide.</p>;

      return messages.map((msg: any, i: number) => (
        <div
          key={i}
          style={{
            padding: "12px 20px",
            borderRadius: "15px",
            fontSize: "13px",
            marginBottom: "10px",
            backgroundColor: msg.role === "user" ? "#F2F2F7" : "#007AFF",
            color: msg.role === "user" ? "#1d1d1f" : "white",
            alignSelf: msg.role === "user" ? "flex-start" : "flex-end",
            maxWidth: "85%",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            wordBreak: "break-word",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "9px",
              opacity: 0.7,
              fontWeight: "bold",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}
          >
            {msg.role === "user" ? "PROSPECT" : "AGENT IA"}
          </p>
          {msg.content}
        </div>
      ));
    } catch (e) {
      return (
        <p style={{ color: "#FF3B30" }}>Erreur d'affichage de la discussion.</p>
      );
    }
  };

  // ÉCRAN 1 : FORMULAIRE DE CONNEXION
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
            padding: "50px",
            borderRadius: "40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            textAlign: "center",
            width: "400px",
          }}
        >
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "800",
              marginBottom: "10px",
              letterSpacing: "-0.02em",
            }}
          >
            Maison Trille
          </h1>
          <p
            style={{ color: "#A1A1A6", fontSize: "14px", marginBottom: "30px" }}
          >
            Accès réservé à l'administration
          </p>
          <input
            type="password"
            placeholder="Mot de passe"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "15px",
              border: loginError ? "1px solid #FF3B30" : "1px solid #F2F2F7",
              backgroundColor: "#F9F9FB",
              marginBottom: "20px",
              outline: "none",
              textAlign: "center",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "15px",
              border: "none",
              background: "#007AFF",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Accéder au Dashboard
          </button>
          {loginError && (
            <p
              style={{ color: "#FF3B30", fontSize: "13px", marginTop: "15px" }}
            >
              Mot de passe incorrect.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ÉCRAN 2 : LE DASHBOARD
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
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            Flux d'audit en temps réel
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "white",
            border: "1px solid #E5E5E7",
            padding: "10px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Déconnexion
        </button>
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
            <p>Chargement des données...</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    fontSize: "11px",
                    color: "#A1A1A6",
                    textTransform: "uppercase",
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
                          cursor: "pointer",
                          fontSize: "12px",
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

        {/* CHAT LOG */}
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
          <div style={{ flex: 1 }}>
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
                Sélectionnez une session pour voir l'échange.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
