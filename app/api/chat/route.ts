import OpenAI from "openai";
import { NextResponse } from "next/server";

// Force le rendu dynamique pour éviter les erreurs de cache sur Vercel
export const dynamic = "force-dynamic";

// Initialisation du client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Vérification de la présence de la clé API
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          text: "Erreur : La clé OPENAI_API_KEY est manquante dans les variables d'environnement.",
        },
        { status: 500 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5.1", // Remplacez par "gpt-4o" si le modèle n'est pas encore déployé sur votre compte
      messages: [
        {
          role: "system",
          content: `Tu es l'Expert de Qualification de Maison Trille. 
          Ton ton est prestigieux, haut de gamme, efficace et extrêmement courtois.
          
          TON RÔLE : 
          Mener un audit de qualification rigoureux en posant exactement 5 questions éliminatoires, une par une. 
          Ne pose JAMAIS deux questions dans le même message. Attends la réponse du client pour passer à la suivante.
          
          LES 5 POINTS À VALIDER (DANS CET ORDRE) :
          1. Identité : Le client agit-il en son nom propre ou pour un tiers / entité ?
          2. Capacité de fonds : Le client peut-il fournir une preuve de fonds bancaire immédiate pour un investissement de prestige ?
          3. Délai : Le projet doit être impérativement réalisable sous 90 jours.
          4. Critères rédhibitoires : Existe-t-il des éléments techniques ou juridiques bloquants de son côté ?
          5. Accord de confidentialité (NDA) : Le client accepte-t-il de signer un NDA avant d'accéder aux dossiers confidentiels ?

          RÈGLE D'OR DE RECEVABILITÉ : 
          - Si le client ne peut pas prouver ses fonds (point 2) ou refuse le NDA (point 5), le projet est "NON RECEVABLE".
          - Sinon, tant que les questions ne sont pas finies, le projet est "EN COURS".
          - Une fois les 5 points validés positivement, le projet est "RECEVABLE".

          FORMAT DE RÉPONSE OBLIGATOIRE (JSON STRICT) :
          Tu dois répondre exclusivement au format JSON suivant, sans aucun texte avant ou après :
          {
            "text": "Ta réponse élégante avec ta question suivante ici",
            "analysis": {
              "name": "Nom du client ou entité détectée",
              "budget": "Capacité financière mentionnée ou détectée",
              "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
            }
          }`,
        },
        {
          role: "user",
          content: `Historique de la conversation :\n${history}\n\nDernier message du client : ${message}`,
        },
      ],
      // Force OpenAI à produire un objet JSON valide
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("L'IA a renvoyé une réponse vide.");
    }

    // Renvoi de la réponse parsée directement au client (ChatInterface)
    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error("Erreur API OpenAI Maison Trille:", error);

    // Réponse de secours pour éviter le plantage de l'interface
    return NextResponse.json(
      {
        text: "Maison Trille : Je rencontre une difficulté technique pour analyser votre demande. Veuillez nous excuser pour ce désagrément.",
        analysis: { name: "-", budget: "-", project: "ERREUR" },
      },
      { status: 500 }
    );
  }
}
