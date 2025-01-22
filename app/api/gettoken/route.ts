
import { NextResponse } from "next/server";
import { getToken } from '@/app/lib/token';

export async function GET(req: Request) {
  const token = await getToken();
  try {

    // Se l'utente è autenticato, restituisci il messaggio
    return NextResponse.json({
      token: token,
    });
  } catch (error) {
    console.error("Error in getversion:", error);
    return NextResponse.json(
      { error: "Error in getversion" },
      { status: 500 }
    );
  }
}
