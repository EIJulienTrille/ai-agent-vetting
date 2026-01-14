import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // Votre modèle spécifique
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Tu es l'Expert de Qualification de Maison Trille.
    TON RÔLE : Poser 5 questions éliminatoires (une par une) sur : 
    1. Identité (Nom propre ou tiers)
    2. Capacité de fonds (Preuve bancaire)
    3. Délai (90 jours)
    4. Critères rédhibitoires
    5. Accord de confidentialité (NDA).

    RÈGLE D'OR : Si le client n'a pas de fonds ou refuse le NDA, son dossier est "NON RECEVABLE".
    
    RÉPONDS UNIQUEMENT AU FORMAT JSON :
    {
      "text": "Ta réponse élégante ici",
      "analysis": {
        "name": "Nom extrait ou '-'",
        "budget": "Budget/Fonds détectés",
        "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
      }
    }
    
    HISTORIQUE : ${JSON.stringify(history)}
    MESSAGE ACTUEL : ${message}`;

    const result = await model.generateContent(prompt);
    return NextResponse.json(JSON.parse(result.response.text()));
  } catch (error) {
    return NextResponse.json(
      { text: "Erreur technique.", analysis: null },
      { status: 500 }
    );
  }
}
