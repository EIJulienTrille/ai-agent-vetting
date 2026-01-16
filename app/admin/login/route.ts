import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    // Debug console (visible uniquement dans les logs Vercel, pas dans le navigateur)
    console.log("Tentative de connexion reçue");

    if (password === correctPassword && correctPassword !== undefined) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
