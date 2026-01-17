import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    // 1. On récupère la session pour savoir qui demande l'historique
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 2. On récupère l'ID de l'utilisateur Julien Trille à partir de son email
    const userRes = await db.query("SELECT id FROM users WHERE email = $1", [
      session.user.email,
    ]);
    const userId = userRes.rows[0]?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // 3. On récupère ses audits du plus récent au plus ancien
    const { rows } = await db.query(
      "SELECT id, status, verdict, created_at FROM vetting_logs WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    // 4. On renvoie les données en JSON
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Erreur API Fetch History:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
