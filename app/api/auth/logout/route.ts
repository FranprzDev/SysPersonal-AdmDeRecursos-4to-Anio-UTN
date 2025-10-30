import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })
    response.cookies.delete("user_session")
    return response
  } catch (error) {
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
  }
}
