"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protection de la route : si pas connecté, redirection vers /login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Chargement...</p>;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main
        style={{
          marginLeft: "260px", // Largeur de la sidebar
          flex: 1,
          height: "100vh",
          backgroundColor: "#F5F5F7",
          padding: "40px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700" }}>
            Bienvenue, {session?.user?.name}
          </h1>
          <p style={{ color: "#8E8E93", marginTop: "10px" }}>
            C'est ici que s'affichera votre interface de messagerie.
          </p>

          {/* C'est ici que nous remettrons votre composant de Chat plus tard */}
          <div
            style={{
              marginTop: "40px",
              height: "60vh",
              backgroundColor: "white",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#D1D1D6",
            }}
          >
            L'interface de chat sera intégrée ici à l'étape suivante.
          </div>
        </div>
      </main>
    </div>
  );
}
