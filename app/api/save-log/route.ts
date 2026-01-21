import { getServerSession } from "next-auth/next";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

// Configuration minimale nécessaire pour la session sans import externe complexe
const authOptions = {
  providers: [], // Les providers sont gérés dans la route principale d'auth
};

export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

export async function POST(req: Request) {
  try {
    // Vérification de la session pour sécuriser l'API
    const session = await getServerSession(authOptions);

    // Si vous voulez restreindre l'écriture aux utilisateurs connectés uniquement :
    // if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { leadId, message, role } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "leadId manquant" }, { status: 400 });
    }

    // Enregistrement du log dans Neon
    await sql`
      INSERT INTO chat_logs (lead_id, role, content)
      VALUES (${leadId}, ${role}, ${message})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur save-log:", error);
    return NextResponse.json({ error: "Erreur technique" }, { status: 500 });
  }
}
