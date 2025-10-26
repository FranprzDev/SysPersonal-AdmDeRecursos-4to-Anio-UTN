import { CapacitacionForm } from "@/components/capacitaciones/capacitacion-form"

export default function NuevaCapacitacionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nueva Capacitación</h1>
        <p className="text-gray-500">Registrar una nueva capacitación</p>
      </div>

      <CapacitacionForm />
    </div>
  )
}
