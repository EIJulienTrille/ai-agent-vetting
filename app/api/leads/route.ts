import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

export async function GET() {
  try {
    // Récupère les leads les plus récents
    const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur de récupération" },
      { status: 500 }
    );
  }
}
