"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F5F5F7",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <main
        style={{ marginLeft: "260px", flex: 1, padding: "0 60px 40px 60px" }}
      >
        <div style={{ height: "100px" }}></div> {/* Espaceur de sécurité */}
        <header style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "900",
              color: "#1d1d1f",
              letterSpacing: "-0.05em",
            }}
          >
            Historique
          </h1>
          <p style={{ color: "#8E8E93", marginTop: "10px" }}>
            Retrouvez vos rapports d'audit passés.
          </p>
        </header>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "30px",
            padding: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
          }}
        >
          {loading ? (
            <p style={{ padding: "20px", color: "#8E8E93" }}>
              Chargement de vos données...
            </p>
          ) : history.length === 0 ? (
            <p style={{ padding: "20px", color: "#8E8E93" }}>
              Aucun audit trouvé.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #F2F2F7",
                    color: "#8E8E93",
                    fontSize: "14px",
                  }}
                >
                  <th style={{ padding: "15px" }}>Date</th>
                  <th style={{ padding: "15px" }}>Verdict</th>
                  <th style={{ padding: "15px" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item: any) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid #F9F9FB" }}
                  >
                    <td style={{ padding: "15px", fontSize: "15px" }}>
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ padding: "15px", fontWeight: "600" }}>
                      {item.verdict}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          backgroundColor:
                            item.status === "valid" ? "#E1F8EB" : "#FFF2F2",
                          color:
                            item.status === "valid" ? "#27AE60" : "#EB5757",
                        }}
                      >
                        {item.status}
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
