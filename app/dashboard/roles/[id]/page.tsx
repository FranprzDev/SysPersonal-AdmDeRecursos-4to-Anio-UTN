import { RolForm } from "@/components/roles/rol-form"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function EditarRolPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  const { data: rol } = await supabase.from("roles").select("*").eq("id_rol", params.id).single()

  if (!rol) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Rol</h1>
        <p className="text-gray-500">Modificar información del rol</p>
      </div>

      <RolForm rol={rol} />
    </div>
  )
}
