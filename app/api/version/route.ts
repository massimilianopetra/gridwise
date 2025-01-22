import { auth } from "@/auth"
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Ottieni la sessione dell'utente
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Se l'utente è autenticato, restituisci il messaggio
    return NextResponse.json({
      message: `OpenTradenet Frontend Version 1 - User: ${session.user?.email}`,
    });
  } catch (error) {
    console.error("Error in getversion:", error);
    return NextResponse.json(
      { error: "Error in getversion" },
      { status: 500 }
    );
  }
}
