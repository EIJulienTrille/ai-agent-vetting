import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// On vérifie que la clé est bien présente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // CHANGEMENT ICI : On utilise la version "latest" pour éviter le 404 de Google
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const promptSystem = `
      Tu es l'assistant de vetting de luxe pour une agence immobilière prestigieuse.
      Ton rôle est de qualifier les prospects de manière élégante.
      CRITÈRES : Budget min 2M€, apport 30%, achat < 6 mois.
      Réponds au message suivant de manière concise : "${message}"
    `;

    const result = await model.generateContent(promptSystem);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error: any) {
    // On affiche l'erreur précise dans le terminal pour nous aider
    console.error("DÉTAIL ERREUR GEMINI :", error.message);

    return NextResponse.json(
      {
        role: "assistant",
        content:
          "Désolé, j'ai une petite difficulté technique. Pouvez-vous reformuler ?",
      },
      { status: 200 } // On met 200 pour que le chat ne plante pas visuellement
    );
  }
}
