import ChatInterface from "@/components/ChatInterface";

// Correction vitale pour Vercel
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ChatInterface />
    </div>
  );
}
