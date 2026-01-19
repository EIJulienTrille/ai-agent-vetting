import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

// Empêche la mise en cache pour garantir des réponses en temps réel
export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sql = neon(process.env.DATABASE_URL || "");

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.OPENAI_API_KEY || !process.env.DATABASE_URL) {
      return NextResponse.json(
        { text: "Erreur de configuration : Clés API ou DB manquantes." },
        { status: 500 }
      );
    }

    // 1. Appel à GPT-5.1 avec le Prompt d'Audit Complet
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: `Tu es l'Expert de Qualification de Maison Trille. Ton ton est prestigieux, haut de gamme et d'une courtoisie absolue.
          
          TON OBJECTIF : Mener un audit de qualification rigoureux en 5 étapes. Tu dois poser une seule question à la fois.
          
          LES 5 QUESTIONS DANS L'ORDRE :
          1. Identité : Agissez-vous en votre nom propre ou pour le compte d'une entité / tiers ?
          2. Capacité de fonds : Êtes-vous en mesure de fournir une preuve de fonds bancaire immédiate pour cet investissement ? (Demande le montant approximatif).
          3. Délai : Le projet est-il impérativement réalisable sous 90 jours ?
          4. Critères : Existe-t-il des spécificités techniques ou juridiques indispensables à vos yeux ?
          5. Confidentialité : Acceptez-vous de signer un accord de confidentialité (NDA) avant d'accéder aux dossiers sensibles ?

          LOGIQUE DE RECEVABILITÉ :
          - Tant que les 5 questions ne sont pas traitées : "project" = "EN COURS".
          - Si le client refuse la preuve de fonds ou le NDA : "project" = "NON RECEVABLE".
          - Si les 5 points sont validés positivement : "project" = "RECEVABLE".

          RÉPONDS EXCLUSIVEMENT AU FORMAT JSON SUIVANT :
          {
            "text": "Ta réponse d'expert et ta question suivante",
            "analysis": {
              "name": "Nom du client détecté ou '-'",
              "budget": "Budget/Fonds détectés ou '-'",
              "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
            }
          }`,
        },
        {
          role: "user",
          content: `Historique : ${history}\n\nDernière réponse du client : ${message}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const data = JSON.parse(response.choices[0].message.content || "{}");

    // 2. Sauvegarde immédiate dans la base de données Neon
    // On enregistre les données extraites par l'IA pour chaque interaction
    await sql`
      INSERT INTO leads (name, budget, project_status, last_message)
      VALUES (
        ${data.analysis?.name || "-"}, 
        ${data.analysis?.budget || "-"}, 
        ${data.analysis?.project || "EN COURS"}, 
        ${data.text}
      )
    `;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erreur Critique Maison Trille:", error);
    return NextResponse.json(
      {
        text: "Désolé, une erreur technique empêche l'analyse de votre dossier. Réessayez.",
      },
      { status: 500 }
    );
  }
}
