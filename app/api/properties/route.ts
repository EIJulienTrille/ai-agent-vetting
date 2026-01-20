import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

// Récupérer tous les biens
export async function GET() {
  try {
    const data = await sql`SELECT * FROM properties ORDER BY created_at DESC`;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la lecture des biens" },
      { status: 500 }
    );
  }
}

// Ajouter un nouveau bien
export async function POST(req: Request) {
  try {
    const { title, description, price, location } = await req.json();
    const result = await sql`
      INSERT INTO properties (title, description, price, location)
      VALUES (${title}, ${description}, ${price}, ${location})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du bien" },
      { status: 500 }
    );
  }
}
