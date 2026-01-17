import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      // Cette ligne force Gemini à sortir du JSON pur sans balises markdown
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Tu es l'Expert de Qualification de Maison Trille. 
    Ton ton est prestigieux et courtois.
    
    TON RÔLE : Poser 5 questions éliminatoires une par une :
    1. Identité (Nom propre ou tiers)
    2. Capacité de fonds (Preuve bancaire)
    3. Délai (90 jours)
    4. Critères rédhibitoires
    5. Accord de confidentialité (NDA).

    RÈGLE D'OR : Si le client n'a pas de fonds ou refuse le NDA, le projet est "NON RECEVABLE".
    
    RÉPONDS EXCLUSIVEMENT AU FORMAT JSON SUIVANT :
    {
      "text": "Ta réponse élégante ici",
      "analysis": {
        "name": "Nom extrait ou '-'",
        "budget": "Budget détecté",
        "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
      }
    }
    
    HISTORIQUE : ${history}
    MESSAGE ACTUEL : ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // On renvoie directement la réponse parsée
    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error("Erreur Gemini:", error);
    return NextResponse.json(
      { text: "Erreur technique de communication.", analysis: null },
      { status: 500 }
    );
  }
}
