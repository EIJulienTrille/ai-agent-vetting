import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

// Récupérer les données d'un lead spécifique
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await sql`SELECT * FROM leads WHERE id = ${id} LIMIT 1`;
    return NextResponse.json(lead[0] || null);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur de récupération" },
      { status: 500 }
    );
  }
}

// Supprimer un lead (existant)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM leads WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Échec suppression" }, { status: 500 });
  }
}
