import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

// Force la lecture en base de données sans cache
export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

export async function GET() {
  try {
    const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
  }
}
