import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction:
        "Tu es l'expert de la Maison Trille. Réponds TOUJOURS au format JSON avec 'text' et 'data' (nom, budget, apport, score).",
    });

    const chat = model.startChat({ history: history || [] });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return NextResponse.json(JSON.parse(response.text()));
  } catch (error: any) {
    console.error("Erreur:", error.message);
    return NextResponse.json(
      { text: "Erreur technique", data: {} },
      { status: 500 }
    );
  }
}
