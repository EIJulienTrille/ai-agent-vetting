import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
