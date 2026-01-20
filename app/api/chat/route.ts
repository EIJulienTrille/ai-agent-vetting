import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { NextResponse } from "next/server";

// Force le mode dynamique pour garantir la fraîcheur des données SQL
export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sql = neon(process.env.DATABASE_URL || "");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { message, history, propertyId } = await req.json();

    // 1. RÉCUPÉRATION DU CONTEXTE DU BIEN (Si présent)
    let propertyContext = "Général (Maison Trille)";
    if (propertyId) {
      const property =
        await sql`SELECT * FROM properties WHERE id = ${propertyId} LIMIT 1`;
      if (property.length > 0) {
        propertyContext = `Bien visé : ${property[0].title} situé à ${property[0].location} au prix de ${property[0].price}.`;
      }
    }

    // 2. APPEL À GPT-5.1 AVEC INJECTION DU CONTEXTE
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: `Tu es l'Expert de Qualification Prestige pour Maison Trille. 
          
          CONTEXTE DU BIEN ACTUEL : ${propertyContext}

          TON OBJECTIF : Mener un audit courtois mais strict en 5 points :
          1. Identité, 2. Preuve de fonds, 3. Délai (90j), 4. Critères techniques, 5. Signature NDA.

          CONSIGNE IMPORTANTE : Intègre naturellement les détails du bien (lieu, prix) dans tes phrases pour montrer que tu connais le dossier.

          RÉPONDS EXCLUSIVEMENT EN JSON :
          {
            "text": "Ta réponse et question suivante",
            "analysis": {
              "name": "Nom ou '-'",
              "budget": "Budget ou '-'",
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

    // 3. LOGIQUE CRM UPSERT (Liaison au bien incluse)
    if (clientName !== "-" && clientName !== "Anonyme") {
      await sql`
        INSERT INTO leads (name, budget, project_status, last_message, property_id)
        VALUES (${clientName}, ${data.analysis.budget}, ${
        data.analysis.project
      }, ${data.text}, ${propertyId || null})
        ON CONFLICT (name) 
        DO UPDATE SET 
          budget = EXCLUDED.budget,
          project_status = EXCLUDED.project_status,
          last_message = EXCLUDED.last_message,
          property_id = COALESCE(EXCLUDED.property_id, leads.property_id),
          created_at = CURRENT_TIMESTAMP;
      `;
    }

    // 4. NOTIFICATION RESEND
    if (data.analysis?.project === "RECEVABLE") {
      await resend.emails.send({
        from: "Maison Trille <onboarding@resend.dev>",
        to: "eijulientrille@gmail.com",
        subject: `✨ Dossier Validé : ${clientName}`,
        html: `<h3>Nouveau prospect qualifié pour : ${propertyContext}</h3>
               <p><strong>Client :</strong> ${clientName}</p>
               <p><strong>Budget :</strong> ${data.analysis.budget}</p>`,
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erreur Chat API:", error);
    return NextResponse.json(
      { text: "Une erreur de synchronisation est survenue." },
      { status: 500 }
    );
  }
}
