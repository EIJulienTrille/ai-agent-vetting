"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protection de la route : Redirection si non connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F5F7",
        }}
      >
        <p style={{ fontFamily: "sans-serif", color: "#8E8E93" }}>
          Chargement de l'espace Maison Trille...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#F5F5F7",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Barre latérale fixe */}
      <Sidebar />

      {/* Zone de contenu principale */}
      <main
        style={{
          marginLeft: "260px",
          flex: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "30px 40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* En-tête de la page */}
          <header style={{ marginBottom: "20px", flexShrink: 0 }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: "800",
                color: "#1d1d1f",
                letterSpacing: "-0.02em",
              }}
            >
              Messagerie
            </h1>
            <p style={{ color: "#8E8E93", fontSize: "14px" }}>
              Expertise Maison Trille
            </p>
          </header>

          {/* Conteneur du Chat (Hauteur 100% de l'espace restant) */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
              flex: 1, // Prend tout l'espace vertical restant
              overflow: "hidden",
              border: "1px solid #E5E5E7",
              marginBottom: "10px",
            }}
          >
            {/* On s'assure que le composant ChatInterface occupe tout le parent */}
            <div style={{ height: "100%", width: "100%" }}>
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
