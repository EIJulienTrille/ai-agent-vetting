"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce client et ses données ?"))
      return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    fetchLeads(); // Rafraîchissement immédiat
  };

  return (
    <div
      style={{
        padding: "40px 60px",
        backgroundColor: "white",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "800",
          marginBottom: "40px",
          letterSpacing: "-0.03em",
        }}
      >
        Gestion des Leads
      </h1>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          border: "1px solid #F2F2F7",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#F9F9FB",
                color: "#8E8E93",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <th style={{ padding: "20px" }}>Client</th>
              <th style={{ padding: "20px" }}>Budget</th>
              <th style={{ padding: "20px" }}>Statut</th>
              <th style={{ padding: "20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: any) => (
              <tr key={lead.id} style={{ borderBottom: "1px solid #F2F2F7" }}>
                <td
                  style={{
                    padding: "20px",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  {lead.name}
                </td>
                <td style={{ padding: "20px", color: "#48484A" }}>
                  {lead.budget}
                </td>
                <td style={{ padding: "20px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: "700",
                      backgroundColor:
                        lead.project_status === "RECEVABLE"
                          ? "#E1F5FE"
                          : "#F2F2F7",
                      color:
                        lead.project_status === "RECEVABLE"
                          ? "#007AFF"
                          : "#8E8E93",
                    }}
                  >
                    {lead.project_status}
                  </span>
                </td>
                <td style={{ padding: "20px", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Link
                      href="/"
                      style={{
                        textDecoration: "none",
                        color: "#007AFF",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Voir Chat
                    </Link>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#FF3B30",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#8E8E93" }}
          >
            Mise à jour du CRM...
          </div>
        )}
      </div>
    </div>
  );
}
