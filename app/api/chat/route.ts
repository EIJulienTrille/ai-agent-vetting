import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Vérification de la clé API pour éviter l'erreur technique silencieuse
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Clé API manquante dans Vercel");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" },
    });

    // CORRECTION : On s'assure que history est bien traité comme du texte
    const formattedHistory = Array.isArray(history)
      ? history.map((m: any) => `${m.role}: ${m.content}`).join("\n")
      : history;

    const prompt = `Tu es l'Expert de Qualification de Maison Trille. Ton ton est prestigieux.
    
    TON RÔLE : Poser 5 questions éliminatoires (une par une).
    IMPORTANT : Tu dois impérativement répondre en JSON STRICT.
    
    STRUCTURE JSON :
    {
      "text": "Ta réponse élégante avec la question suivante",
      "analysis": {
        "name": "Nom extrait",
        "budget": "Fonds",
        "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
      }
    }
    
    HISTORIQUE CONVERSATION :
    ${formattedHistory}
    
    DERNIER MESSAGE CLIENT : 
    ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Sécurité supplémentaire si l'IA renvoie quand même des balises
    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error: any) {
    console.error("Erreur Gemini détaillée:", error);
    return NextResponse.json(
      {
        text: "Maison Trille : Je rencontre une difficulté technique pour analyser votre demande. Veuillez m'excuser et réessayer.",
        analysis: { name: "-", budget: "-", project: "ERREUR" },
      },
      { status: 500 }
    );
  }
}
