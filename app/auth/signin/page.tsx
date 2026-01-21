"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Page de connexion sécurisée pour les agents Maison Trille.
 * Utilise NextAuth pour la gestion des sessions.
 */
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Tentative de connexion via le provider 'credentials'
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Identifiants invalides. Veuillez réessayer.");
      setLoading(false);
    } else {
      // Redirection vers le dashboard après succès
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={logoStyle}>MAISON TRILLE</h1>
          <p style={subtitleStyle}>Accès réservé aux agents certifiés</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Adresse Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@maison-trille.com"
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              required
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Authentification..." : "Se connecter"}
          </button>
        </form>

        <p style={footerLinkStyle}>
          Mot de passe oublié ? Contactez l'administrateur.
        </p>
      </div>
    </div>
  );
}

// STYLES CSS-IN-JS (Corrigés pour éviter les erreurs de référence)
const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#F9F9FB",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  padding: "50px",
  backgroundColor: "white",
  borderRadius: "24px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
  border: "1px solid #F2F2F7",
};

const logoStyle: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: "900",
  letterSpacing: "-0.04em",
  color: "#1C1C1E",
  margin: "0 0 10px 0",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#8E8E93",
  margin: 0,
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#1C1C1E",
  paddingLeft: "4px",
};

const inputStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #E5E5E7",
  backgroundColor: "#F9F9FB",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s",
};

const buttonStyle: React.CSSProperties = {
  padding: "16px",
  backgroundColor: "#1C1C1E",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "700",
  marginTop: "10px",
  transition: "background-color 0.2s",
};

const errorStyle: React.CSSProperties = {
  color: "#FF3B30",
  fontSize: "13px",
  textAlign: "center",
  fontWeight: "500",
  margin: 0,
};

const footerLinkStyle: React.CSSProperties = {
  textAlign: "center",
  marginTop: "30px",
  fontSize: "13px",
  color: "#8E8E93",
  cursor: "pointer",
};
