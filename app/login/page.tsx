"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // États du formulaire
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegistering) {
      // LOGIQUE D'INSCRIPTION
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Une fois inscrit, on connecte l'utilisateur automatiquement
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });
        if (result?.ok) router.push("/"); // Redirection vers la messagerie
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'inscription");
      }
    } else {
      // LOGIQUE DE CONNEXION
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        setError("Email ou mot de passe incorrect");
      }
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F5F7",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "30px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          width: "380px",
          textAlign: "center",
        }}
      >
        <h1
          style={{ fontSize: "24px", fontWeight: "800", marginBottom: "10px" }}
        >
          Maison Trille
        </h1>
        <p style={{ color: "#8E8E93", fontSize: "14px", marginBottom: "30px" }}>
          {isRegistering
            ? "Créez votre compte client"
            : "Connectez-vous à votre espace"}
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {isRegistering && (
            <input
              type="text"
              placeholder="Nom complet"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading
              ? "Chargement..."
              : isRegistering
              ? "S'inscrire"
              : "Se connecter"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#FF3B30", fontSize: "13px", marginTop: "15px" }}>
            {error}
          </p>
        )}

        <p
          style={{
            marginTop: "25px",
            fontSize: "14px",
            color: "#007AFF",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Déjà un compte ? Connectez-vous"
            : "Pas de compte ? Inscrivez-vous"}
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #E5E5E7",
  backgroundColor: "#F9F9FB",
  outline: "none",
  fontSize: "15px",
};

const buttonStyle = {
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#007AFF",
  color: "white",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px",
};
