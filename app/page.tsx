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
          padding: "50px 60px 30px 60px", // Augmentation du padding haut (50px) et latéral (60px)
        }}
      >
        {/* En-tête aérée */}
        <header style={{ flexShrink: 0, marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#1d1d1f",
              letterSpacing: "-0.03em",
              marginBottom: "8px",
            }}
          >
            Messagerie
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#34C759",
                borderRadius: "50%",
              }}
            ></span>
            <p
              style={{ color: "#8E8E93", fontSize: "14px", fontWeight: "500" }}
            >
              Expertise Maison Trille — Audit en cours
            </p>
          </div>
        </header>

        {/* Conteneur du Chat */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "32px", // Coins plus arrondis pour un aspect plus moderne
            boxShadow: "0 20px 60px rgba(0,0,0,0.04)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <ChatInterface />
        </div>

        {/* Petit footer discret pour l'espace */}
        <footer style={{ height: "20px", flexShrink: 0 }}></footer>
      </main>
    </div>
  );
}
