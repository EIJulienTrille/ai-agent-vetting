import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { text: "Clé API manquante sur Vercel.", analysis: null },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" },
    });

    // On s'assure que l'historique est une chaîne propre
    const prompt = `Tu es l'Expert de Qualification de Maison Trille.
    TON RÔLE : Poser 5 questions éliminatoires (une par une).
    IMPORTANT : Réponds UNIQUEMENT au format JSON strict.
    
    STRUCTURE JSON :
    {
      "text": "Ta réponse élégante ici",
      "analysis": {
        "name": "Nom extrait",
        "budget": "Fonds",
        "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
      }
    }
    
    HISTORIQUE DE LA CONVERSATION :
    ${history}
    
    MESSAGE ACTUEL DU CLIENT :
    ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      // Nettoyage au cas où Gemini ajouterait des balises markdown malgré la config
      const cleanJson = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return NextResponse.json(JSON.parse(cleanJson));
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", responseText);
      return NextResponse.json({
        text: "Je n'ai pas pu formater ma réponse. Pouvez-vous répéter ?",
        analysis: null,
      });
    }
  } catch (error: any) {
    console.error("Erreur Serveur:", error);
    return NextResponse.json(
      { text: "Erreur technique Maison Trille." },
      { status: 500 }
    );
  }
}
