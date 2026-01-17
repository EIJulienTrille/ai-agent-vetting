import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialisation avec votre clé API Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Utilisation de votre modèle Gemini 3 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `Tu es l'Expert de Qualification de Maison Trille. 
    Ton ton est prestigieux, efficace et extrêmement courtois.
    
    TON RÔLE : 
    Mener un audit de qualification en posant exactement 5 questions éliminatoires, une par une. 
    Ne pose jamais deux questions en même temps.
    
    LES 5 POINTS À VALIDER DANS L'ORDRE :
    1. Identité : Le client agit-il en son nom propre ou pour un tiers ?
    2. Capacité de fonds : Le client peut-il fournir une preuve de fonds bancaire immédiate ?
    3. Délai : Le projet est-il réalisable sous 90 jours ?
    4. Critères rédhibitoires : Y a-t-il des éléments (techniques ou financiers) qui pourraient bloquer le dossier ?
    5. Accord de confidentialité (NDA) : Le client accepte-t-il de signer un NDA pour accéder aux dossiers confidentiels ?

    RÈGLE D'OR : 
    Si le client répond négativement sur les fonds bancaires (point 2) ou refuse le NDA (point 5), 
    le projet doit être déclaré immédiatement comme "NON RECEVABLE".

    FORMAT DE RÉPONSE OBLIGATOIRE (JSON STRICT) :
    Tu dois répondre exclusivement au format JSON suivant. Ne rajoute aucun texte avant ou après le bloc JSON.
    {
      "text": "Ta réponse élégante ici (incluant ta question suivante)",
      "analysis": {
        "name": "Nom ou entité détecté",
        "budget": "Capacité financière détectée",
        "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
      }
    }

    CONTEXTE DE LA CONVERSATION :
    Historique : ${JSON.stringify(history)}
    Dernier message du client : ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // SÉCURITÉ ANTI-ERREUR TECHNIQUE : Nettoyage du JSON
    // Extrait uniquement le contenu entre les premières et dernières accolades
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("L'IA n'a pas renvoyé un format JSON valide.");
    }

    const cleanData = JSON.parse(jsonMatch[0]);
    return NextResponse.json(cleanData);
  } catch (error: any) {
    console.error("Erreur Gemini 3 Flash:", error);

    // Réponse de secours pour éviter le plantage de l'interface (Error_42 & 43)
    return NextResponse.json(
      {
        text: "Maison Trille : Je rencontre une difficulté technique pour analyser votre demande. Veuillez m'excuser et réessayer.",
        analysis: { name: "-", budget: "-", project: "ERREUR" },
      },
      { status: 500 }
    );
  }
}
