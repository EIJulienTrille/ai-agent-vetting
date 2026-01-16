import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agency_id, status, verdict, conversation, error } = body;

    // --- SÉCURITÉ RGPD ---
    // On nettoie les données sensibles pour ne pas stocker d'infos personnelles identifiables
    const anonymizedChat = conversation.map((msg: any) => ({
      ...msg,
      content: msg.content
        .replace(/[0-9]{2}[0-9]{8}/g, "[TÉLÉPHONE MASQUÉ]") // Masque les numéros
        .replace(/\S+@\S+\.\S+/g, "[EMAIL MASQUÉ]"), // Masque les emails
    }));

    // --- ENREGISTREMENT ---
    await db.query(
      `INSERT INTO vetting_logs (agency_id, status, verdict, conversation_data, error_message)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        agency_id || "maison-trille-default",
        status,
        verdict || "EN COURS",
        JSON.stringify(anonymizedChat),
        error || null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erreur de logging database:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
