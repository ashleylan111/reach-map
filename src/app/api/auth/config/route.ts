import { NextResponse } from "next/server";

export async function GET() {
  const google = Boolean(
    process.env.CLIENT_ID_GOOGLE && process.env.CLIENT_GOOGLE_SECRET,
  );
  return NextResponse.json({ google });
}
