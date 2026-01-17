import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.query("DELETE FROM vetting_logs WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur de suppression" },
      { status: 500 }
    );
  }
}
