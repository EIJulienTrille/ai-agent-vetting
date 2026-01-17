import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // 1. Récupérer la session de l'utilisateur (côté serveur)
    const session = await getServerSession(authOptions);

    // 2. Vérifier si l'utilisateur est bien connecté
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { status, verdict, conversation_data } = await req.json();

    // 3. Récupérer l'ID de l'utilisateur via son email
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

    // 4. Insérer le log avec le user_id associé
    await db.query(
      "INSERT INTO vetting_logs (status, verdict, conversation_data, user_id) VALUES ($1, $2, $3, $4)",
      [
        status,
        verdict,
        typeof conversation_data === "string"
          ? conversation_data
          : JSON.stringify(conversation_data),
        userId,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur API Save Log:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}
