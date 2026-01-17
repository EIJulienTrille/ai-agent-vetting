import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validation basique
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // 2. Cryptage du mot de passe (ne jamais stocker en clair !)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insertion dans la base de données Postgres
    await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    return NextResponse.json(
      { message: "Utilisateur créé avec succès" },
      { status: 201 }
    );
  } catch (err: any) {
    // Gestion de l'erreur si l'email existe déjà (contrainte UNIQUE en SQL)
    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
