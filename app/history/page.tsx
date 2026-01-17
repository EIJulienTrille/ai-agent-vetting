"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function HistoryPage() {
  // CORRECTION ICI : On définit le type comme any[] pour éviter l'erreur TypeScript
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/fetch-history");
        const data = await res.json();
        // Vérification que data est bien un tableau avant de l'enregistrer
        if (Array.isArray(data)) {
          setHistory(data);
        }
      } catch (e) {
        console.error("Erreur de récupération", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
        <div style={{ height: "100px", flexShrink: 0 }}></div>
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
            Rapports d'audit Maison Trille
          </p>
        </header>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "30px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {loading ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#8E8E93" }}
            >
              Chargement...
            </div>
          ) : history.length === 0 ? (
            <div
              style={{ padding: "60px", textAlign: "center", color: "#8E8E93" }}
            >
              Aucun audit trouvé.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#F9F9FB" }}>
                <tr>
                  <th style={thStyle}>DATE</th>
                  <th style={thStyle}>VERDICT</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid #F2F2F7" }}
                  >
                    <td style={tdStyle}>
                      {new Date(item.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: "700" }}>
                      {item.verdict || "Analyse en cours"}
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
const tdStyle = { padding: "20px 24px", fontSize: "15px", color: "#1d1d1f" };
