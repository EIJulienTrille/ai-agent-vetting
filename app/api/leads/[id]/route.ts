import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM leads WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Échec suppression" }, { status: 500 });
  }
}
