import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Configuration de l'API avec votre clé
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Utilisation du modèle exact spécifié dans votre code
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction:
        "Tu es l'expert de la Maison Trille. Réponds TOUJOURS au format JSON avec 'text' et 'analysis'.",
    });

    // Mapping pour Gemini : le rôle 'assistant' devient 'model'
    const chat = model.startChat({
      history: history.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      {
        text: "Veuillez m'excuser, une brève interruption technique perturbe notre échange.",
        analysis: null,
      },
      { status: 500 }
    );
  }
}
