import { type NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/supabase/api"
import { hash } from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const supabase = createApiClient()
    const body = await request.json()

    const {
      dni,
      nombre,
      apellido,
      fecha_nacimiento,
      direccion,
      telefono,
      email,
      id_sector,
      dni_supervisor,
      activo = true,
    } = body

    const { data: empleado, error: empleadoError } = await supabase
      .from("empleados")
      .insert([
        {
          dni,
          nombre,
          apellido,
          fecha_nacimiento,
          direccion: direccion || null,
          telefono: telefono || null,
          email,
          id_sector: id_sector || null,
          dni_supervisor: dni_supervisor || null,
          activo,
        },
      ])
      .select()
      .single()

    if (empleadoError) {
      return NextResponse.json({ error: empleadoError.message }, { status: 400 })
    }

    const hashedPassword = await hash(dni, 10)

    const { error: usuarioError } = await supabase.from("usuarios").insert([
      {
        email,
        password: hashedPassword,
        rol_sistema: "empleado",
        dni_empleado: dni,
        activo,
      },
    ])

    if (usuarioError && usuarioError.code !== "23505") {
      console.error("Error al crear usuario:", usuarioError)
    }

    return NextResponse.json({ success: true, empleado })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

