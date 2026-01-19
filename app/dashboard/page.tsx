"use client";
import React, { useEffect, useState } from "react";

interface Lead {
  id: number;
  name: string;
  budget: string;
  project_status: string;
  last_message: string;
  created_at: string;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#F9F9FB",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "30px",
          color: "#1C1C1E",
        }}
      >
        Expertise Maison Trille — Gestion des Leads
      </h1>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
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
                backgroundColor: "#F2F2F7",
                color: "#8E8E93",
                fontSize: "13px",
                textTransform: "uppercase",
              }}
            >
              <th style={{ padding: "15px 20px" }}>Client</th>
              <th style={{ padding: "15px 20px" }}>Budget</th>
              <th style={{ padding: "15px 20px" }}>Statut</th>
              <th style={{ padding: "15px 20px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                style={{ borderBottom: "1px solid #F2F2F7", fontSize: "15px" }}
              >
                <td style={{ padding: "15px 20px", fontWeight: "600" }}>
                  {lead.name}
                </td>
                <td style={{ padding: "15px 20px" }}>{lead.budget}</td>
                <td style={{ padding: "15px 20px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor:
                        lead.project_status === "RECEVABLE"
                          ? "#E1F5FE"
                          : lead.project_status === "NON RECEVABLE"
                          ? "#FFEBEE"
                          : "#F2F2F7",
                      color:
                        lead.project_status === "RECEVABLE"
                          ? "#0288D1"
                          : lead.project_status === "NON RECEVABLE"
                          ? "#D32F2F"
                          : "#8E8E93",
                    }}
                  >
                    {lead.project_status}
                  </span>
                </td>
                <td style={{ padding: "15px 20px", color: "#8E8E93" }}>
                  {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#8E8E93" }}
          >
            Chargement des données Neon...
          </div>
        )}
      </div>
    </div>
  );
}
