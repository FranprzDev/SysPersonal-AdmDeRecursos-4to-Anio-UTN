"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmpleadoModal } from "./empleado-modal"

export function EmpleadosTable({ empleados }: { empleados: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sectorFilter, setSectorFilter] = useState("all")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEmpleado, setSelectedEmpleado] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const filteredEmpleados = empleados.filter((emp) => {
    const matchesSearch =
      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.dni.includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSector = sectorFilter === "all" || emp.id_sector?.toString() === sectorFilter
    const matchesEstado = estadoFilter === "all" || (estadoFilter === "activo" ? emp.activo : !emp.activo)

    return matchesSearch && matchesSector && matchesEstado
  })

  const sectores = Array.from(new Set(empleados.map((e) => e.sector?.nombre_sector).filter(Boolean)))

  const handleDelete = async (dni: string) => {
    try {
      const { error } = await supabase.from("empleados").update({ activo: false }).eq("dni", dni)

      if (error) throw error

      toast({
        title: "Empleado dado de baja",
        description: "El empleado ha sido dado de baja correctamente",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (empleado: any) => {
    setSelectedEmpleado(empleado)
    setModalOpen(true)
  }

  const handleNew = () => {
    setSelectedEmpleado(null)
    setModalOpen(true)
  }

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, DNI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los sectores</SelectItem>
            {sectores.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="activo">Activos</SelectItem>
            <SelectItem value="inactivo">Inactivos</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Empleado
        </Button>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DNI</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmpleados.map((empleado) => (
              <TableRow key={empleado.dni}>
                <TableCell className="font-medium">{empleado.dni}</TableCell>
                <TableCell>
                  {empleado.nombre} {empleado.apellido}
                </TableCell>
                <TableCell>{empleado.email}</TableCell>
                <TableCell>{empleado.telefono || "-"}</TableCell>
                <TableCell>{empleado.sector?.nombre_sector || "-"}</TableCell>
                <TableCell>
                  <Badge variant={empleado.activo ? "default" : "secondary"}>
                    {empleado.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(empleado)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar baja</AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Está seguro que desea dar de baja a este empleado? Esta acción se puede revertir.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(empleado.dni)}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EmpleadoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        empleado={selectedEmpleado}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
