"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Interface définissant la structure d'un Lead provenant de Neon
 */
interface Lead {
  id: number;
  name: string;
  budget: string;
  project_status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération des leads depuis l'API
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch (e) {
      console.error("Erreur de chargement des leads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Fonction de suppression d'un prospect
  const deleteLead = async (id: number) => {
    if (
      !confirm(
        "Voulez-vous vraiment supprimer ce prospect et tout son historique ?"
      )
    )
      return;

    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Mise à jour locale de la liste après suppression
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      }
    } catch (e) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div
      style={{
        padding: "40px 60px",
        backgroundColor: "white",
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Expertise Maison Trille — Gestion des Leads
        </h1>
        <p style={{ color: "#8E8E93", marginTop: "8px", fontSize: "16px" }}>
          Suivi en temps réel des dossiers qualifiés par GPT-5.1
        </p>
      </div>

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
              <th style={{ padding: "20px" }}>Date</th>
              <th style={{ padding: "20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                style={{
                  borderBottom: "1px solid #F2F2F7",
                  transition: "background 0.2s",
                }}
              >
                <td
                  style={{
                    padding: "20px",
                    fontWeight: "600",
                    color: "#1C1C1E",
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
                <td
                  style={{
                    padding: "20px",
                    color: "#8E8E93",
                    fontSize: "14px",
                  }}
                >
                  {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td style={{ padding: "20px", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      justifyContent: "flex-end",
                    }}
                  >
                    {/* Lien vers la page principale avec l'ID du prospect */}
                    <Link
                      href={`/?leadId=${lead.id}`}
                      style={{
                        textDecoration: "none",
                        color: "#007AFF",
                        fontSize: "14px",
                        fontWeight: "600",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        transition: "background 0.2s",
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
                        padding: "8px 12px",
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
            Synchronisation avec la base Neon...
          </div>
        )}

        {!loading && leads.length === 0 && (
          <div
            style={{ padding: "60px", textAlign: "center", color: "#8E8E93" }}
          >
            Aucun prospect détecté pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
