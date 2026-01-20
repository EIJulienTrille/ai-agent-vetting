import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

// Récupérer les réglages
export async function GET() {
  try {
    const data = await sql`SELECT * FROM agency_settings WHERE id = 1`;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}

// Mettre à jour les réglages
export async function POST(req: Request) {
  try {
    const { agency_name, contact_email, website_url, signature_text } =
      await req.json();
    const result = await sql`
      UPDATE agency_settings 
      SET agency_name = ${agency_name}, 
          contact_email = ${contact_email}, 
          website_url = ${website_url}, 
          signature_text = ${signature_text},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur de mise à jour" },
      { status: 500 }
    );
  }
}
