import { type NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api"
import { compare } from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 })
    }

    const supabase = createApiClient()

    const { data: user, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ 
        error: "Error al consultar la base de datos",
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    if (!user.activo) {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 401 })
    }

    const isPasswordHashed = user.password.startsWith("$2a$") || user.password.startsWith("$2b$")
    
    let passwordMatch = false
    
    if (isPasswordHashed) {
      passwordMatch = await compare(password, user.password)
    } else {
      passwordMatch = password === user.password
    }

    if (!passwordMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({ success: true, user: userWithoutPassword })

    response.cookies.set("user_session", JSON.stringify(userWithoutPassword), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
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
