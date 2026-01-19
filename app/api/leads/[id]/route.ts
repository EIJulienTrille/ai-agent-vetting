import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

// Force le rendu dynamique pour éviter les erreurs de build
export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL || "");

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Correction du typage Promise
) {
  try {
    const { id } = await params; // Extraction asynchrone de l'ID

    await sql`DELETE FROM leads WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression:", error);
    return NextResponse.json(
      { error: "Échec de la suppression" },
      { status: 500 }
    );
  }
}
