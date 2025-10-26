"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { RolesTable } from "@/components/roles/roles-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RolModal } from "@/components/roles/rol-modal"

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRol, setSelectedRol] = useState<any>(null)
  const supabase = createClient()

  const loadRoles = async () => {
    const { data } = await supabase.from("roles").select("*").order("nombre_rol")
    setRoles(data || [])
  }

  useEffect(() => {
    loadRoles()
  }, [])

  const handleEdit = (rol: any) => {
    setSelectedRol(rol)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelectedRol(null)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-500">Gestión de roles del sistema</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Rol
        </Button>
      </div>

      <RolesTable roles={roles} onEdit={handleEdit} onDelete={loadRoles} />

      <RolModal open={modalOpen} onOpenChange={setModalOpen} rol={selectedRol} onSuccess={loadRoles} />
    </div>
  )
}
