"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { FichasMedicasTable } from "@/components/fichas-medicas/fichas-medicas-table"
import { FichaMedicaModal } from "@/components/fichas-medicas/ficha-medica-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function FichasMedicasPage() {
  const [fichas, setFichas] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFicha, setSelectedFicha] = useState<any>(null)
  const supabase = createClient()

  const loadFichas = async () => {
    const { data } = await supabase
      .from("fichas_medicas")
      .select(`
        *,
        empleado:empleados(nombre, apellido, dni)
      `)
      .order("fecha_control", { ascending: false })

    setFichas(data || [])
  }

  useEffect(() => {
    loadFichas()
  }, [])

  const handleEdit = (ficha: any) => {
    setSelectedFicha(ficha)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedFicha(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFicha(null)
    loadFichas()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fichas Médicas</h1>
          <p className="text-gray-500">Gestión de información médica del personal</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ficha Médica
        </Button>
      </div>

      <FichasMedicasTable fichas={fichas} onEdit={handleEdit} />

      <FichaMedicaModal isOpen={isModalOpen} onClose={handleCloseModal} ficha={selectedFicha} />
    </div>
  )
}
