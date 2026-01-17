"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à l'API renommée pour éviter tout conflit de route Next.js
    fetch("/api/fetch-history")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F5F5F7",
        height: "100vh",
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
          padding: "0 60px 40px 60px",
        }}
      >
        <div style={{ height: "100px", flexShrink: 0 }}></div>{" "}
        {/* Spacer Arc */}
        <header style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "900",
              letterSpacing: "-0.05em",
            }}
          >
            Historique
          </h1>
          <p style={{ color: "#8E8E93" }}>
            Vos rapports d'audit Maison Trille.
          </p>
        </header>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "30px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              Chargement...
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#F9F9FB" }}>
                <tr>
                  <th style={thStyle}>DATE</th>
                  <th style={thStyle}>VERDICT</th>
                  <th style={thStyle}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item: any) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid #F2F2F7" }}
                  >
                    <td style={tdStyle}>
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: "700" }}>
                      {item.verdict || "Analyse..."}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "800",
                          backgroundColor:
                            item.status === "valid" ? "#E1F8EB" : "#FFF2F2",
                          color:
                            item.status === "valid" ? "#27AE60" : "#EB5757",
                        }}
                      >
                        {item.status?.toUpperCase()}
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

const thStyle = {
  padding: "20px 24px",
  textAlign: "left" as const,
  fontSize: "12px",
  color: "#8E8E93",
};
const tdStyle = { padding: "20px 24px", fontSize: "15px" };
