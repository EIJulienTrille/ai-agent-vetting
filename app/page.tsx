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
          // On passe à 80px en haut pour vraiment décoller du bord
          padding: "80px 80px 40px 80px",
        }}
      >
        {/* En-tête : On ajoute une marge interne supplémentaire ici si besoin */}
        <header style={{ flexShrink: 0, marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "850",
              color: "#1d1d1f",
              letterSpacing: "-0.04em",
              marginBottom: "12px",
            }}
          >
            Messagerie
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#34C759",
                borderRadius: "50%",
                boxShadow: "0 0 8px rgba(52, 199, 89, 0.4)",
              }}
            ></span>
            <p
              style={{ color: "#8E8E93", fontSize: "15px", fontWeight: "500" }}
            >
              Expertise Maison Trille — Session active
            </p>
          </div>
        </header>

        {/* Conteneur du Chat : Plus de courbes et d'ombre pour la profondeur */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "38px",
            boxShadow: "0 30px 90px rgba(0,0,0,0.06)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            border: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
