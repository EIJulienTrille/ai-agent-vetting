import { getServerSession } from "next-auth/next";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const authOptions = {}; // Configuration locale pour éviter les erreurs de chemin

export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Sécurité : Seul un agent connecté peut voir l'historique complet
    if (!session) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // Récupération de l'historique classé par date
    const history = await sql`
      SELECT role, content, created_at 
      FROM chat_logs 
      WHERE lead_id = ${leadId} 
      ORDER BY created_at ASC
    `;

    return NextResponse.json(history);
  } catch (error) {
    console.error("Erreur fetch-history:", error);
    return NextResponse.json(
      { error: "Erreur de base de données" },
      { status: 500 }
    );
  }
}
