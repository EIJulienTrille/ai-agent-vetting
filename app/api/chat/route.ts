import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialisation de l'IA avec la clé d'API présente dans vos variables d'environnement
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Utilisation de votre modèle spécifique Gemini 3 Flash
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `Tu es l'Expert de Qualification de Maison Trille. 
    Ton ton est prestigieux, efficace et extrêmement courtois.
    
    TON RÔLE : 
    Mener un audit de qualification en posant exactement 5 questions éliminatoires, une par une. 
    Ne pose jamais deux questions en même temps.
    
    LES 5 POINTS À VALIDER :
    1. Identité : Le client agit-il en son nom propre ou pour un tiers ?
    2. Capacité de fonds : Le client peut-il fournir une preuve de fonds bancaire immédiate ?
    3. Délai : Le projet doit être réalisable sous 90 jours.
    4. Critères rédhibitoires : Y a-t-il des éléments qui pourraient bloquer le dossier ?
    5. Accord de confidentialité (NDA) : Le client accepte-t-il de signer un NDA pour accéder aux dossiers ?

    RÈGLE D'OR : 
    Si le client répond négativement sur les fonds (point 2) ou refuse le NDA (point 5), 
    le projet doit passer immédiatement en "NON RECEVABLE".

    FORMAT DE RÉPONSE OBLIGATOIRE (JSON UNIQUEMENT) :
    Tu dois répondre exclusivement au format JSON suivant, sans aucun texte avant ou après :
    {
      "text": "Ta réponse élégante et ta question suivante ici",
      "analysis": {
        "name": "Nom du client ou entité si détecté",
        "budget": "Capacité financière détectée",
        "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
      }
    }

    CONTEXTE DE LA CONVERSATION :
    Historique : ${JSON.stringify(history)}
    Dernier message du client : ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // NETTOYAGE ET PARSING DU JSON
    // Gemini entoure parfois le JSON de balises ```json, ce qui cause l'erreur technique.
    // Cette regex extrait uniquement le contenu entre les accolades {}.
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Format JSON non détecté dans la réponse de l'IA");
    }

    const cleanJson = JSON.parse(jsonMatch[0]);

    return NextResponse.json(cleanJson);
  } catch (error: any) {
    console.error("Erreur API Chat Maison Trille:", error);

    // En cas d'erreur, on renvoie une réponse propre au format attendu par ChatInterface.tsx
    return NextResponse.json(
      {
        text: "Maison Trille : Je rencontre une difficulté technique pour analyser votre demande. Veuillez m'excuser et réessayer.",
        analysis: { name: "-", budget: "-", project: "ERREUR" },
      },
      { status: 500 }
    );
  }
}
