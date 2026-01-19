import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sql = neon(process.env.DATABASE_URL || "");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: `Tu es l'Expert Maison Trille. Ton ton est prestigieux. 
          Pose 5 questions (une par une) : 1.Identité, 2.Fonds, 3.Délai, 4.Critères, 5.NDA.
          RÉPONDS EN JSON : { "text": "...", "analysis": { "name": "...", "budget": "...", "project": "RECEVABLE/NON RECEVABLE/EN COURS" } }`,
        },
        {
          role: "user",
          content: `Historique : ${history}\n\nClient : ${message}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(response.choices[0].message.content || "{}");
    const clientName = data.analysis?.name || "-";

    // Logique UPSERT : Un seul client par nom dans le Dashboard
    if (clientName !== "-" && clientName !== "Anonyme") {
      await sql`
        INSERT INTO leads (name, budget, project_status, last_message)
        VALUES (${clientName}, ${data.analysis?.budget || "-"}, ${
        data.analysis?.project || "EN COURS"
      }, ${data.text})
        ON CONFLICT (name) 
        DO UPDATE SET 
          budget = EXCLUDED.budget,
          project_status = EXCLUDED.project_status,
          last_message = EXCLUDED.last_message,
          created_at = CURRENT_TIMESTAMP;
      `;
    }

    if (data.analysis?.project === "RECEVABLE") {
      await resend.emails.send({
        from: "Maison Trille <onboarding@resend.dev>",
        to: "eijulientrille@gmail.com",
        subject: "✨ Prospect Qualifié - Maison Trille",
        html: `<p>Le dossier de <strong>${clientName}</strong> est désormais RECEVABLE.</p>`,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { text: "Erreur de synchronisation CRM." },
      { status: 500 }
    );
  }
}
