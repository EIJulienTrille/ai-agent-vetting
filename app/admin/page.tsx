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

  // --- LOGIQUE D'EXPORTATION AVEC COORDONNÉES ---
  const exportToCSV = () => {
    const headers = [
      "Date",
      "Statut",
      "Verdict",
      "Nom/Prénom",
      "Email",
      "Téléphone",
    ].join(",");

    const rows = logs.map((log) => {
      let nom = "Non renseigné";
      let email = "Non renseigné";
      let tel = "Non renseigné";

      try {
        const messages =
          typeof log.conversation_data === "string"
            ? JSON.parse(log.conversation_data)
            : log.conversation_data;

        if (Array.isArray(messages)) {
          messages.forEach((m: any) => {
            const text = m.content;
            // Détection Email
            const emailMatch = text.match(
              /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/
            );
            if (emailMatch) email = emailMatch[0];

            // Détection Téléphone (format FR)
            const telMatch = text.match(
              /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/
            );
            if (telMatch) tel = telMatch[0];

            // Détection Nom (si l'IA a écrit "Nom: ...")
            if (
              text.toLowerCase().includes("nom :") ||
              text.toLowerCase().includes("nom:")
            ) {
              nom = text.split(/:|Nom/i)[1]?.trim().split("\n")[0] || nom;
            }
          });
        }
      } catch (e) {
        console.error("Erreur CSV", e);
      }

      return [
        new Date(log.created_at).toLocaleDateString("fr-FR"),
        log.status,
        log.verdict,
        `"${nom.replace(/"/g, "")}"`,
        email,
        tel,
      ].join(",");
    });

    const csvContent = "\uFEFF" + headers + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-maison-trille-${
      new Date().toISOString().split("T")[0]
    }.csv`;
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

  const renderConversation = (data: any) => {
    try {
      const messages = typeof data === "string" ? JSON.parse(data) : data;
      if (!Array.isArray(messages)) return <p>Aucun message.</p>;
      return messages.map((msg: any, i: number) => (
        <div
          key={i}
          style={{
            padding: "12px",
            borderRadius: "15px",
            marginBottom: "10px",
            fontSize: "13px",
            backgroundColor: msg.role === "user" ? "#F2F2F7" : "#007AFF",
            color: msg.role === "user" ? "black" : "white",
            alignSelf: msg.role === "user" ? "flex-start" : "flex-end",
            maxWidth: "85%",
          }}
        >
          <span
            style={{ fontSize: "9px", fontWeight: "bold", display: "block" }}
          >
            {msg.role === "user" ? "PROSPECT" : "IA"}
          </span>
          {msg.content}
        </div>
      ));
    } catch {
      return <p>Erreur d'affichage.</p>;
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
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "30px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Administration</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
            placeholder="Mot de passe"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F5F5F7",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <h1>MONITORING</h1>
        <button
          onClick={exportToCSV}
          style={{
            backgroundColor: "#34C759",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Exporter CSV
        </button>
      </header>

      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            flex: 1.5,
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "20px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ textAlign: "left", color: "#888", fontSize: "12px" }}
              >
                <th>DATE</th>
                <th>STATUT</th>
                <th>VERDICT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "15px 0" }}>
                    {new Date(log.created_at).toLocaleDateString()}
                  </td>
                  <td
                    style={{
                      color: log.status === "SUCCESS" ? "#34C759" : "#FF3B30",
                    }}
                  >
                    ● {log.status}
                  </td>
                  <td>{log.verdict}</td>
                  <td>
                    <button
                      onClick={() => setSelectedLog(log)}
                      style={{
                        background: "#007AFF",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        marginRight: "5px",
                        cursor: "pointer",
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
                        padding: "5px 10px",
                        borderRadius: "8px",
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
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3>Historique</h3>
          {selectedLog ? (
            renderConversation(selectedLog.conversation_data)
          ) : (
            <p style={{ color: "#ccc" }}>Sélectionnez une session.</p>
          )}
        </div>
      </div>
    </div>
  );
}
