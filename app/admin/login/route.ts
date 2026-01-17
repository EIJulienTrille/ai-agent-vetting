import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // On récupère la variable configurée sur Vercel
    const correctPassword = process.env.ADMIN_PASSWORD;

    // Log de sécurité pour vos tests (visible dans Vercel Logs)
    console.log("Password reçu:", password, " | Attendu:", correctPassword);

    if (password === correctPassword) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
