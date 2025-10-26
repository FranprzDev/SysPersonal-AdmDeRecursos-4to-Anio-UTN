"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { CapacitacionesTable } from "@/components/capacitaciones/capacitaciones-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CapacitacionModal } from "@/components/capacitaciones/capacitacion-modal"

export default function CapacitacionesPage() {
  const [capacitaciones, setCapacitaciones] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCapacitacion, setSelectedCapacitacion] = useState<any>(null)
  const supabase = createClient()

  const loadCapacitaciones = async () => {
    const { data } = await supabase.from("capacitaciones").select("*").order("fecha_inicio", { ascending: false })
    setCapacitaciones(data || [])
  }

  useEffect(() => {
    loadCapacitaciones()
  }, [])

  const handleEdit = (capacitacion: any) => {
    setSelectedCapacitacion(capacitacion)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelectedCapacitacion(null)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Capacitaciones</h1>
          <p className="text-gray-500">Gestión de capacitaciones del personal</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Capacitación
        </Button>
      </div>

      <CapacitacionesTable capacitaciones={capacitaciones} onEdit={handleEdit} onDelete={loadCapacitaciones} />

      <CapacitacionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        capacitacion={selectedCapacitacion}
        onSuccess={loadCapacitaciones}
      />
    </div>
  )
}
