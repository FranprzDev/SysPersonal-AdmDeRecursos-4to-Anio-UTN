import { type NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api"
import { hash } from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const supabase = createApiClient()

    const { data: usuarios, error: fetchError } = await supabase
      .from("usuarios")
      .select("id_usuario, email, password, dni_empleado")
      .eq("rol_sistema", "empleado")

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const usuariosSinHash = usuarios?.filter(
      (u) => !u.password.startsWith("$2a$") && !u.password.startsWith("$2b$")
    ) || []

    if (usuariosSinHash.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "Todas las contraseñas ya están hasheadas",
        processed: 0 
      })
    }

    const resultados = []

    for (const usuario of usuariosSinHash) {
      try {
        const dniEmpleado = usuario.dni_empleado || usuario.password
        const hashedPassword = await hash(dniEmpleado, 10)

        const { error: updateError } = await supabase
          .from("usuarios")
          .update({ password: hashedPassword })
          .eq("id_usuario", usuario.id_usuario)

        if (updateError) {
          resultados.push({ 
            email: usuario.email, 
            status: "error", 
            error: updateError.message 
          })
        } else {
          resultados.push({ 
            email: usuario.email, 
            status: "success" 
          })
        }
      } catch (error: any) {
        resultados.push({ 
          email: usuario.email, 
          status: "error", 
          error: error.message 
        })
      }
    }

    const successCount = resultados.filter((r) => r.status === "success").length

    return NextResponse.json({
      success: true,
      message: `Se procesaron ${usuariosSinHash.length} usuarios`,
      processed: successCount,
      errors: resultados.filter((r) => r.status === "error").length,
      resultados,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

