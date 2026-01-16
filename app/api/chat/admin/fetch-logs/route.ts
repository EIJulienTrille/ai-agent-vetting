import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

// On force Next.js à ne pas mettre cette page en cache pour avoir les logs en temps réel
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Connexion à la base et récupération des 50 derniers logs
    const { rows } = await db.query(
      "SELECT * FROM vetting_logs ORDER BY created_at DESC LIMIT 50"
    );

    return NextResponse.json({ logs: rows });
  } catch (err: any) {
    console.error("Erreur lors de la récupération des logs:", err);
    return NextResponse.json(
      { error: "Impossible de récupérer les logs", details: err.message },
      { status: 500 }
    );
  }
}
