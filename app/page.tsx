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
          padding: "0 60px 40px 60px", // On met le padding haut à 0 ici
          overflow: "hidden",
        }}
      >
        {/* 1. ESPACEUR DE SÉCURITÉ (Pour Arc et les navigateurs modernes) */}
        <div style={{ height: "100px", flexShrink: 0 }}></div>

        {/* 2. EN-TÊTE BIEN DESCENDU */}
        <header style={{ flexShrink: 0, marginBottom: "35px" }}>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "900",
              color: "#1d1d1f",
              letterSpacing: "-0.05em",
              margin: 0,
              lineHeight: "1.2",
            }}
          >
            Messagerie
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#34C759",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(52, 199, 89, 0.5)",
              }}
            ></span>
            <p
              style={{ color: "#8E8E93", fontSize: "15px", fontWeight: "500" }}
            >
              Expertise Maison Trille — Session active
            </p>
          </div>
        </header>

        {/* 3. CONTENEUR DU CHAT */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "35px",
            boxShadow: "0 25px 70px rgba(0,0,0,0.05)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
