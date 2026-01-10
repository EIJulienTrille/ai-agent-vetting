"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bienvenue chez Maison Trille. Quel est votre projet ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState({
    nom: "Inconnu",
    budget: "Inconnu",
    apport: "Inconnu",
    score: "-",
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Correction historique : on retire le message de bienvenue pour commencer par 'user'
      const chatHistory = newMessages.slice(1, -1).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input, history: chatHistory }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text },
      ]);
      if (data.data) setClientData(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col border-r shadow-2xl">
        <header className="p-8 border-b text-center">
          <h1 className="text-2xl tracking-[0.3em] uppercase font-light">
            Maison Trille
          </h1>
          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mt-2"></div>
        </header>
        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-6 bg-[#FAFAFA]"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              } message-appear`}
            >
              <div
                className={`p-5 rounded-sm max-w-[75%] text-sm shadow-sm ${
                  m.role === "user"
                    ? "bg-black text-white"
                    : "bg-white border text-gray-700"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </main>
        <footer className="p-8 border-t">
          <div className="flex gap-4 border-b pb-2">
            <input
              className="flex-1 bg-transparent outline-none text-sm italic"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Exprimez vos souhaits..."
            />
            <button
              onClick={sendMessage}
              className="text-xs uppercase tracking-widest hover:text-[#C5A059]"
            >
              Envoyer
            </button>
          </div>
        </footer>
      </div>
      <aside className="w-96 p-10 bg-white flex flex-col">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-12 text-[#C5A059]">
          Qualification Prospect
        </h2>
        <div className="space-y-10 flex-1">
          {["nom", "budget", "apport"].map((f) => (
            <div key={f}>
              <label className="text-[10px] text-gray-300 uppercase block mb-1">
                {f}
              </label>
              <p className="text-sm font-light border-b pb-2 uppercase">
                {clientData[f as keyof typeof clientData]}
              </p>
            </div>
          ))}
          <div>
            <label className="text-[10px] text-gray-300 uppercase block mb-2">
              Statut
            </label>
            <div
              className={`inline-block px-6 py-2 border text-xs ${
                clientData.score === "A"
                  ? "border-green-200 text-green-600 bg-green-50"
                  : "border-gray-100 text-gray-400"
              }`}
            >
              RANG {clientData.score}
            </div>
          </div>
        </div>
        <button
          onClick={() => alert("Transmis")}
          className="w-full py-4 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#C5A059]"
        >
          Transmettre
        </button>
      </aside>
    </div>
  );
}
