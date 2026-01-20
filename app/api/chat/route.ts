import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { NextResponse } from "next/server";

// Force le rendu dynamique pour garantir que les réglages de l'agence et les biens soient à jour
export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sql = neon(process.env.DATABASE_URL || "");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { message, history, propertyId } = await req.json();

    // 1. RÉCUPÉRATION DYNAMIQUE DES RÉGLAGES DE L'AGENCE
    const settings =
      await sql`SELECT * FROM agency_settings WHERE id = 1 LIMIT 1`;
    const agencyName = settings[0]?.agency_name || "Maison Trille";
    const contactEmail =
      settings[0]?.contact_email || "votre-email@exemple.com";

    // 2. RÉCUPÉRATION DU CONTEXTE DU BIEN (Si propertyId est présent)
    let propertyContext = `Général (${agencyName})`;
    let propertyTitle = "un bien de l'agence";

    if (propertyId) {
      const property =
        await sql`SELECT * FROM properties WHERE id = ${propertyId} LIMIT 1`;
      if (property.length > 0) {
        propertyTitle = property[0].title;
        propertyContext = `Bien visé : ${propertyTitle} à ${property[0].location} (${property[0].price}).`;
      }
    }

    // 3. APPEL À GPT-5.1
    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "system",
          content: `Tu es l'Expert de Qualification pour l'agence immobilière de prestige : ${agencyName}. 
          
          CONTEXTE ACTUEL : ${propertyContext}

          TON OBJECTIF : Mener un audit en 5 points (Identité, Fonds, Délai, Critères, NDA).
          RÉPONDS EXCLUSIVEMENT AU FORMAT JSON :
          {
            "text": "Ta réponse fluide et ta question suivante",
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

    // 4. LOGIQUE CRM UPSERT
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

    // 5. ENVOI D'EMAIL VIA RESEND (La balise oubliée)
    if (data.analysis?.project === "RECEVABLE") {
      await resend.emails.send({
        from: `${agencyName} <onboarding@resend.dev>`,
        to: contactEmail, // Utilise l'email configuré dans la page Settings
        subject: `✨ Dossier Qualifié : ${clientName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Nouveau prospect qualifié pour ${agencyName}</h2>
            <p><strong>Client :</strong> ${clientName}</p>
            <p><strong>Bien concerné :</strong> ${propertyTitle}</p>
            <p><strong>Budget estimé :</strong> ${data.analysis.budget}</p>
            <hr />
            <p>Connectez-vous à votre dashboard Maison Trille pour consulter l'historique complet.</p>
          </div>
        `,
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erreur API Chat:", error);
    return NextResponse.json(
      { text: "Une erreur technique est survenue." },
      { status: 500 }
    );
  }
}
