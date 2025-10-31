"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { FichasMedicasTable } from "@/components/fichas-medicas/fichas-medicas-table"
import { FichaMedicaModal } from "@/components/fichas-medicas/ficha-medica-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { getPermisosPorRol } from "@/lib/permissions"
import type { RolSistema } from "@/lib/permissions"

export default function FichasMedicasPage() {
  const [fichas, setFichas] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFicha, setSelectedFicha] = useState<any>(null)
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

  const loadFichas = async () => {
    const { data } = await supabase
      .from("fichas_medicas")
      .select(`
        *,
        empleado:empleados(nombre, apellido, dni)
      `)
      .eq("activo", true)
      .order("fecha_control", { ascending: false })

    setFichas(data || [])
  }

  useEffect(() => {
    loadFichas()
  }, [])

  const handleEdit = (ficha: any) => {
    if (!permisos.fichasMedicas.editar) return
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

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("fichas_medicas")
        .update({ activo: false })
        .eq("id_ficha", id)

      if (error) throw error

      toast.success("La ficha médica ha sido eliminada correctamente")

      loadFichas()
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar la ficha médica")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fichas Médicas</h1>
          <p className="text-gray-500">Gestión de información médica del personal</p>
        </div>
        {permisos.fichasMedicas.crear && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Ficha Médica
          </Button>
        )}
      </div>

      <FichasMedicasTable fichas={fichas} onEdit={handleEdit} onDelete={handleDelete} permisos={permisos.fichasMedicas} />

      {permisos.fichasMedicas.crear || permisos.fichasMedicas.editar ? (
        <FichaMedicaModal isOpen={isModalOpen} onClose={handleCloseModal} ficha={selectedFicha} />
      ) : null}
    </div>
  )
}
