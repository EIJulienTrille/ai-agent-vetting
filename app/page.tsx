"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return null;

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
          height: "100vh",
          padding: "20px 40px", // Réduction du padding pour gagner de la place
        }}
      >
        {/* En-tête avec hauteur fixe pour ne pas écraser le reste */}
        <header style={{ flexShrink: 0, marginBottom: "15px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1d1d1f" }}>
            Messagerie
          </h1>
          <p style={{ color: "#8E8E93", fontSize: "13px" }}>
            Expertise Maison Trille
          </p>
        </header>

        {/* CONTENEUR DYNAMIQUE DU CHAT */}
        <div
          style={{
            flex: 1, // Prend TOUT l'espace restant mathématiquement
            backgroundColor: "white",
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0, // Très important pour forcer le scroll interne
          }}
        >
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
