import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'ID de l'utilisateur
    const userRes = await db.query("SELECT id FROM users WHERE email = $1", [
      session.user.email,
    ]);
    const userId = userRes.rows[0]?.id;

    // Récupérer les logs triés par date
    const { rows } = await db.query(
      "SELECT id, status, verdict, created_at FROM vetting_logs WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}
