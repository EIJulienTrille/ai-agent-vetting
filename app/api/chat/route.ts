import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialisation de l'IA avec la clé API configurée dans Vercel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Configuration du modèle Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Force l'IA à répondre en JSON pur pour éviter l'erreur technique de parsing
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `Tu es l'Expert de Qualification de Maison Trille. 
    Ton ton est prestigieux, efficace et extrêmement courtois.
    
    TON RÔLE : 
    Mener un audit de qualification en posant exactement 5 questions éliminatoires, une par une. 
    Ne pose jamais deux questions en même temps.
    
    LES 5 POINTS À VALIDER (DANS L'ORDRE) :
    1. Identité : Le client agit-il en son nom propre ou pour un tiers ?
    2. Capacité de fonds : Le client peut-il fournir une preuve de fonds bancaire immédiate ?
    3. Délai : Le projet est-il réalisable sous 90 jours ?
    4. Critères rédhibitoires : Y a-t-il des éléments bloquants ?
    5. Accord de confidentialité (NDA) : Le client accepte-t-il de signer un NDA ?

    RÈGLE D'OR : 
    Si le client répond négativement sur les fonds (point 2) ou refuse le NDA (point 5), 
    le projet doit passer immédiatement en "NON RECEVABLE".

    FORMAT DE RÉPONSE OBLIGATOIRE (JSON STRICT) :
    Tu dois répondre exclusivement au format JSON suivant :
    {
      "text": "Ta réponse élégante et ta question suivante ici",
      "analysis": {
        "name": "Nom du client",
        "budget": "Fonds détectés",
        "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
      }
    }

    CONTEXTE :
    Historique : ${history}
    Dernier message : ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Nettoyage de sécurité pour garantir un JSON valide
    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error: any) {
    console.error("Erreur API Maison Trille:", error);

    // Réponse de secours pour l'interface en cas d'erreur 429 ou 500
    return NextResponse.json(
      {
        text: "Maison Trille : Je rencontre une difficulté technique ou une limite de quota. Veuillez patienter un instant.",
        analysis: { name: "-", budget: "-", project: "ERREUR" },
      },
      { status: 500 }
    );
  }
}
