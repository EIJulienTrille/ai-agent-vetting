import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Configuration pour garantir que la route n'est pas mise en cache
export const dynamic = "force-dynamic";
const sql = neon(process.env.DATABASE_URL || "");

/**
 * Route API pour l'inscription de nouveaux agents immobiliers.
 * Vérifie l'existence de l'utilisateur, hache le mot de passe et l'enregistre dans Neon.
 */
export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. Validation de base des champs
    if (!email || !password || !name) {
      return NextResponse.json(
        {
          error:
            "Tous les champs (nom, email, mot de passe) sont obligatoires.",
        },
        { status: 400 }
      );
    }

    // 2. Vérification de l'existence de l'utilisateur dans Neon
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà." },
        { status: 400 }
      );
    }

    // 3. Hachage du mot de passe pour la sécurité
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Insertion du nouvel agent dans la base de données
    const newUser = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email, created_at
    `;

    return NextResponse.json(
      {
        message: "Agent enregistré avec succès.",
        user: newUser[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      {
        error: "Une erreur interne est survenue lors de la création du compte.",
      },
      { status: 500 }
    );
  }
}
