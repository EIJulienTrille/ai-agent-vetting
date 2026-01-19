import ChatInterface from "@/components/ChatInterface";
import { Suspense } from "react";

/**
 * Force le rendu dynamique pour garantir que les paramètres d'URL (leadId)
 * et les données de la base Neon soient toujours à jour.
 */
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      {/* L'utilisation de Suspense est requise car ChatInterface utilise useSearchParams 
          pour restaurer les conversations depuis le Dashboard.
      */}
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              fontFamily: "sans-serif",
              color: "#8E8E93",
            }}
          >
            Chargement de l'expertise Maison Trille...
          </div>
        }
      >
        <ChatInterface />
      </Suspense>
    </div>
  );
}
