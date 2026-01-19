import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { NextResponse } from "next/server";

// Force le rendu dynamique pour éviter les erreurs de build
export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sql = neon(process.env.DATABASE_URL || "");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // 1. Appel à GPT-5.1 avec le protocole de qualification complet
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: `Tu es l'Expert de Qualification de Maison Trille. Ton ton est prestigieux.
          
          TON OBJECTIF : Poser 5 questions (une par une) : 
          1. Identité, 2. Preuve de fonds, 3. Délai (90j), 4. Critères, 5. NDA.

          RÉPONDS EXCLUSIVEMENT AU FORMAT JSON SUIVANT :
          {
            "text": "Ta réponse élégante avec ta question suivante",
            "analysis": {
              "name": "Nom du client ou '-'",
              "budget": "Budget détecté ou '-'",
              "project": "RECEVABLE, NON RECEVABLE ou EN COURS"
            }
          }`,
        },
        {
          role: "user",
          content: `Historique : ${history}\n\nClient : ${message}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const data = JSON.parse(response.choices[0].message.content || "{}");
    const clientName = data.analysis?.name || "-";

    // 2. LOGIQUE CRM : Mise à jour ou Insertion (UPSERT)
    // Si le nom est détecté, on met à jour la ligne existante au lieu d'en créer une nouvelle.
    if (clientName !== "-") {
      await sql`
        INSERT INTO leads (name, budget, project_status, last_message)
        VALUES (
          ${clientName}, 
          ${data.analysis?.budget || "-"}, 
          ${data.analysis?.project || "EN COURS"}, 
          ${data.text}
        )
        ON CONFLICT (name) 
        DO UPDATE SET 
          budget = EXCLUDED.budget,
          project_status = EXCLUDED.project_status,
          last_message = EXCLUDED.last_message,
          created_at = CURRENT_TIMESTAMP;
      `;
    }

    // 3. Notification Resend si le dossier devient RECEVABLE
    if (data.analysis?.project === "RECEVABLE") {
      await resend.emails.send({
        from: "Maison Trille <onboarding@resend.dev>",
        to: "eijulientrille@gmail.com",
        subject: "✨ Nouveau Dossier Qualifié - Maison Trille",
        html: `<p>Le client <strong>${clientName}</strong> est désormais qualifié.</p>`,
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erreur API Maison Trille:", error);
    return NextResponse.json(
      { text: "Erreur technique de synchronisation." },
      { status: 500 }
    );
  }
}
