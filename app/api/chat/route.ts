import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json(); // On simplifie l'entrée au maximum

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // Votre modèle validé
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Tu es l'expert de la Maison Trille. Analyse ce message et réponds TOUJOURS en JSON pur.
    Format attendu : { "text": "votre réponse", "analysis": { "name": "...", "budget": "...", "project": "..." } }
    
    Message du client : ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      {
        text: "Veuillez m'excuser, une brève interruption technique perturbe notre échange.",
        analysis: { name: "-", budget: "-", project: "-" },
      },
      { status: 500 }
    );
  }
}
