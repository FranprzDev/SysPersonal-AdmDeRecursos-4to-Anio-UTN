import { type NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api"
import { hash } from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const supabase = createApiClient()

    const { data: users, error } = await supabase.from("usuarios").select("*")

    if (error) {
      return NextResponse.json({ error: "Error al consultar usuarios" }, { status: 500 })
    }

    const updates = []

    for (const user of users || []) {
      if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
        const hashedPassword = await hash(user.password, 10)

        const { error: updateError } = await supabase
          .from("usuarios")
          .update({ password: hashedPassword })
          .eq("id_usuario", user.id_usuario)

        if (updateError) {
          updates.push({ email: user.email, error: updateError.message })
        } else {
          updates.push({ email: user.email, status: "success" })
        }
      } else {
        updates.push({ email: user.email, status: "already hashed" })
      }
    }

    return NextResponse.json({ success: true, updates })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

