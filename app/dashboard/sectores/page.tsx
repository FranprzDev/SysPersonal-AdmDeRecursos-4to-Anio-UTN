"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { SectoresTable } from "@/components/sectores/sectores-table"
import { SectorModal } from "@/components/sectores/sector-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function SectoresPage() {
  const [sectores, setSectores] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSector, setSelectedSector] = useState<any>(null)

  const supabase = createClient()

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
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Sector
        </Button>
      </div>

      <SectoresTable sectores={sectores} onEdit={handleEdit} onDelete={fetchSectores} />

      <SectorModal open={modalOpen} onOpenChange={setModalOpen} sector={selectedSector} onSuccess={handleSuccess} />
    </div>
  )
}
