import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { NextResponse } from "next/server";

// Empêche la mise en cache pour garantir des réponses en temps réel
export const dynamic = "force-dynamic";

// Initialisation des clients (Assurez-vous que les variables d'env sont sur Vercel)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sql = neon(process.env.DATABASE_URL || "");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Vérification de sécurité des clés API
    if (
      !process.env.OPENAI_API_KEY ||
      !process.env.DATABASE_URL ||
      !process.env.RESEND_API_KEY
    ) {
      return NextResponse.json(
        {
          text: "Erreur de configuration : Variables d'environnement manquantes.",
        },
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
          1. Identité : Agissez-vous en votre nom propre ou pour le compte d'une entité ?
          2. Capacité de fonds : Êtes-vous en mesure de fournir une preuve de fonds bancaire immédiate pour cet investissement ?
          3. Délai : Le projet est-il impérativement réalisable sous 90 jours ?
          4. Critères : Existe-t-il des spécificités techniques ou juridiques indispensables ?
          5. Confidentialité : Acceptez-vous de signer un NDA avant d'accéder aux dossiers sensibles ?

          LOGIQUE DE RECEVABILITÉ :
          - Tant que les 5 questions ne sont pas traitées : "project" = "EN COURS".
          - Si le client refuse la preuve de fonds ou le NDA : "project" = "NON RECEVABLE".
          - Si les 5 points sont validés positivement : "project" = "RECEVABLE".

          RÉPONDS EXCLUSIVEMENT AU FORMAT JSON SUIVANT :
          {
            "text": "Ta réponse d'expert et ta question suivante",
            "analysis": {
              "name": "Nom du client ou '-'",
              "budget": "Budget détecté ou '-'",
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
    await sql`
      INSERT INTO leads (name, budget, project_status, last_message)
      VALUES (
        ${data.analysis?.name || "-"}, 
        ${data.analysis?.budget || "-"}, 
        ${data.analysis?.project || "EN COURS"}, 
        ${data.text}
      )
    `;

    // 3. Notification Email via Resend si le dossier est validé
    if (data.analysis?.project === "RECEVABLE") {
      await resend.emails.send({
        from: "Maison Trille <onboarding@resend.dev>",
        to: "eijulientrille@gmail.com", // Remplacez par votre email réel
        subject: "✨ Nouveau Dossier Qualifié - Maison Trille",
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #1C1C1E;">Un nouveau client a été validé par l'IA</h2>
            <p><strong>Nom :</strong> ${data.analysis.name}</p>
            <p><strong>Budget :</strong> ${data.analysis.budget}</p>
            <p><strong>Statut :</strong> RECEVABLE</p>
            <hr />
            <p style="color: #8E8E93;">Consultez votre dashboard Maison Trille pour plus de détails.</p>
          </div>
        `,
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erreur Critique API:", error);
    return NextResponse.json(
      { text: "Une erreur technique empêche l'analyse. Veuillez patienter." },
      { status: 500 }
    );
  }
}
