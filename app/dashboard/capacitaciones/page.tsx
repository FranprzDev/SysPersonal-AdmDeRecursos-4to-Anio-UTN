"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { CapacitacionesTable } from "@/components/capacitaciones/capacitaciones-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CapacitacionModal } from "@/components/capacitaciones/capacitacion-modal"
import { AsignarCapacitacion } from "@/components/capacitaciones/asignar-capacitacion"
import { getPermisosPorRol } from "@/lib/permissions"
import type { RolSistema } from "@/lib/permissions"

export default function CapacitacionesPage() {
  const [capacitaciones, setCapacitaciones] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [asignarModalOpen, setAsignarModalOpen] = useState<boolean>(false)
  const [selectedCapacitacion, setSelectedCapacitacion] = useState<any>(null)
  const [selectedCapacitacionAsignar, setSelectedCapacitacionAsignar] = useState<any>(null)
  const [rol, setRol] = useState<RolSistema>("admin")
  const supabase = createClient()

  useEffect(() => {
    const getUserSession = async () => {
      const response = await fetch("/api/auth/session")
      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setRol(data.user.rol_sistema)
        }
      }
    }
    getUserSession()
  }, [])

  const permisos = getPermisosPorRol(rol)

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

  const handleAsignar = (capacitacion: any) => {
    setSelectedCapacitacionAsignar(capacitacion)
    setAsignarModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Capacitaciones</h1>
          <p className="text-gray-500">Gestión de capacitaciones del personal</p>
        </div>
        {permisos.capacitaciones.crear && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Capacitación
          </Button>
        )}
      </div>

      <CapacitacionesTable
        capacitaciones={capacitaciones}
        onEdit={handleEdit}
        onDelete={loadCapacitaciones}
        onAsignar={handleAsignar}
        permisos={permisos.capacitaciones}
      />

      {permisos.capacitaciones.crear && (
        <>
          <CapacitacionModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            capacitacion={selectedCapacitacion}
            onSuccess={loadCapacitaciones}
          />

          {selectedCapacitacionAsignar && (
            <AsignarCapacitacion
              capacitacionId={selectedCapacitacionAsignar.id_capacitacion}
              open={asignarModalOpen}
              onOpenChange={setAsignarModalOpen}
              onSuccess={loadCapacitaciones}
            />
          )}
        </>
      )}
    </div>
  )
}
