"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { SectoresTable } from "@/components/sectores/sectores-table"
import { SectorModal } from "@/components/sectores/sector-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getPermisosPorRol } from "@/lib/permissions"
import type { RolSistema } from "@/lib/permissions"

export default function SectoresPage() {
  const [sectores, setSectores] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSector, setSelectedSector] = useState<any>(null)
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

  const fetchSectores = async () => {
    const { data, error } = await supabase
      .from("sectores")
      .select(`
        *,
        supervisor:empleados!sectores_dni_supervisor_fkey(nombre, apellido)
      `)
      .order("nombre_sector", { ascending: true })

    if (error) {
      console.error("Error fetching sectores:", error)
      return
    }

    if (data) setSectores(data)
  }

  useEffect(() => {
    fetchSectores()
  }, [])

  const handleEdit = (sector: any) => {
    setSelectedSector(sector)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelectedSector(null)
    setModalOpen(true)
  }

  const handleSuccess = () => {
    fetchSectores()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sectores</h1>
          <p className="text-gray-500">Gestión de sectores de la organización</p>
        </div>
        {permisos.sectores.crear && (
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Sector
          </Button>
        )}
      </div>

      <SectoresTable sectores={sectores} onEdit={handleEdit} onDelete={fetchSectores} permisos={permisos.sectores} />
      
      {permisos.sectores.crear && (
        <SectorModal open={modalOpen} onOpenChange={setModalOpen} sector={selectedSector} onSuccess={handleSuccess} />
      )}
    </div>
  )
}
