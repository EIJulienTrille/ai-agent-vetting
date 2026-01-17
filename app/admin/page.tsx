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

  // --- FONCTION EXPORT CSV ---
  const exportToCSV = () => {
    const headers = ["Date,Statut,Verdict,Lien\n"];
    const rows = logs.map(
      (log) =>
        `${new Date(log.created_at).toLocaleDateString()},${log.status},${
          log.verdict
        }\n`
    );
    const blob = new Blob([headers + rows.join("")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-maison-trille-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  // --- FONCTION SUPPRESSION ---
  const deleteLog = async (id: string) => {
    if (!confirm("Supprimer cette session ?")) return;
    const res = await fetch("/api/admin/delete-log", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (res.ok) setLogs(logs.filter((l) => l.id !== id));
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

  if (!isAuthenticated) {
    return (
      <div
        style={{
          backgroundColor: "#F5F5F7",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            padding: "15px",
            borderRadius: "15px",
            border: "1px solid #ddd",
          }}
          placeholder="Mot de passe"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F5F5F7",
        minHeight: "100vh",
        padding: "40px 60px",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800" }}>MONITORING</h1>
          <p style={{ color: "#A1A1A6" }}>Maison Trille — Audit</p>
        </div>
        <button
          onClick={exportToCSV}
          style={{
            background: "#34C759",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Exporter CSV
        </button>
      </header>

      <div style={{ display: "flex", gap: "30px" }}>
        <div
          style={{
            flex: "1.5",
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "30px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  color: "#A1A1A6",
                  fontSize: "11px",
                }}
              >
                <th>DATE</th>
                <th>STATUT</th>
                <th>VERDICT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderTop: "1px solid #F2F2F7" }}>
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
                  <td style={{ fontWeight: "700" }}>{log.verdict}</td>
                  <td>
                    <button
                      onClick={() => setSelectedLog(log)}
                      style={{
                        marginRight: "10px",
                        background: "#007AFF",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Voir
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
            flex: "1",
            backgroundColor: "white",
            borderRadius: "32px",
            padding: "30px",
            minHeight: "500px",
          }}
        >
          {selectedLog ? "Historique Chat..." : "Sélectionnez une session"}
        </div>
      </div>
    </div>
  );
}
