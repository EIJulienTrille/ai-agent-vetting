"use client";
import React, { useEffect, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    agency_name: "",
    contact_email: "",
    website_url: "",
    signature_text: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) setForm(data);
      });
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage("Configuration enregistrée avec succès.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Configuration Pro</h1>
      <p style={subtitleStyle}>
        Personnalisez l'identité de votre agence sur la plateforme.
      </p>

      <form onSubmit={saveSettings} style={formStyle}>
        <div style={groupStyle}>
          <label style={labelStyle}>Nom de l'agence</label>
          <input
            value={form.agency_name}
            onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Email de contact (pour les leads)</label>
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) =>
              setForm({ ...form, contact_email: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Site Web</label>
          <input
            value={form.website_url}
            onChange={(e) => setForm({ ...form, website_url: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Signature automatique</label>
          <textarea
            value={form.signature_text}
            onChange={(e) =>
              setForm({ ...form, signature_text: e.target.value })
            }
            style={textareaStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Sauvegarder les modifications
        </button>

        {message && <p style={successStyle}>{message}</p>}
      </form>
    </div>
  );
}

// DÉFINITION DES STYLES (Obligatoire pour corriger l'erreur 49)
const containerStyle: React.CSSProperties = {
  padding: "40px 60px",
  fontFamily: "sans-serif",
  backgroundColor: "white",
  minHeight: "100vh",
};
const titleStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "800",
  marginBottom: "10px",
  letterSpacing: "-0.02em",
};
const subtitleStyle: React.CSSProperties = {
  color: "#8E8E93",
  marginBottom: "40px",
};
const formStyle: React.CSSProperties = {
  maxWidth: "600px",
  display: "flex",
  flexDirection: "column",
  gap: "25px",
};
const groupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};
const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1C1C1E",
};
const inputStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #E5E5E7",
  fontSize: "15px",
  outline: "none",
};
const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "100px",
  resize: "none",
};
const buttonStyle: React.CSSProperties = {
  backgroundColor: "#007AFF",
  color: "white",
  border: "none",
  padding: "16px",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "16px",
};
const successStyle: React.CSSProperties = {
  color: "#34C759",
  fontWeight: "600",
  textAlign: "center",
};
