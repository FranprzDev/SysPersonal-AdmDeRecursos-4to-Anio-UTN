import { type NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const supabase = createApiClient()

    const { data: user, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .eq("activo", true)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: "Error al consultar la base de datos" }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true, user })

    response.cookies.set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
