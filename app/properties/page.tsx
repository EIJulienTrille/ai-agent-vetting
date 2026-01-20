"use client";
import React, { useEffect, useState } from "react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
  });

  const fetchProperties = async () => {
    const res = await fetch("/api/properties");
    const data = await res.json();
    setProperties(data);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/properties", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setForm({ title: "", price: "", location: "", description: "" });
    fetchProperties();
  };

  return (
    <div style={{ padding: "40px 60px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "30px" }}>
        Mes Biens en Vente
      </h1>

      {/* Formulaire d'ajout */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#F9F9FB",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <input
          placeholder="Titre du bien (ex: Loft Marais)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          placeholder="Prix (ex: 1 200 000 €)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          style={inputStyle}
        />
        <input
          placeholder="Localisation"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          style={inputStyle}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#1C1C1E",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Ajouter le bien
        </button>
      </form>

      {/* Liste des biens */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {properties.map((p: any) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #F2F2F7",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{p.title}</h3>
            <p style={{ color: "#8E8E93", fontSize: "14px" }}>
              {p.location} — {p.price}
            </p>
            <div
              style={{
                marginTop: "15px",
                fontSize: "12px",
                color: "#007AFF",
                fontWeight: "bold",
              }}
            >
              Lien de chat : {window.location.origin}/?propertyId={p.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #E5E5E7",
  fontSize: "14px",
};
