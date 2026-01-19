import ChatInterface from "@/components/ChatInterface";

/**
 * LIGNE CRUCIALE : Force le rendu dynamique.
 * Cela empêche Next.js de tenter de pré-calculer cette page comme une page statique,
 * ce qui causait les erreurs de build 46 et 47 car la page dépend d'API interactives.
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
      {/* Le composant ChatInterface contient toute la logique de messagerie 
          connectée à GPT-5.1 et à la base de données Neon.
      */}
      <ChatInterface />
    </div>
  );
}
