import { RolForm } from "@/components/roles/rol-form"

export default function NuevoRolPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Rol</h1>
        <p className="text-gray-500">Crear un nuevo rol en el sistema</p>
      </div>

      <RolForm />
    </div>
  )
}
