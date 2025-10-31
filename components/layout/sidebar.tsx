"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { puedeAccederAModulo } from "@/lib/permissions"
import type { RolSistema } from "@/lib/permissions"
import {
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  FileText,
  Clock,
  Heart,
  BarChart3,
  History,
  Home,
  User,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, modulo: "reportes" as const },
  { name: "Empleados", href: "/dashboard/empleados", icon: Users, modulo: "empleados" as const },
  { name: "Sectores", href: "/dashboard/sectores", icon: Building2, modulo: "sectores" as const },
  { name: "Roles", href: "/dashboard/roles", icon: Briefcase, modulo: "roles" as const },
  { name: "Capacitaciones", href: "/dashboard/capacitaciones", icon: GraduationCap, modulo: "capacitaciones" as const },
  { name: "Asistencia", href: "/dashboard/asistencia", icon: Clock, modulo: "asistencia" as const },
  { name: "Fichas Médicas", href: "/dashboard/fichas-medicas", icon: Heart, modulo: "fichasMedicas" as const },
  { name: "Reportes", href: "/dashboard/reportes", icon: FileText, modulo: "reportes" as const },
  { name: "Historial", href: "/dashboard/historial", icon: History, modulo: "historial" as const },
  { name: "Desempeño", href: "/dashboard/desempeno", icon: BarChart3, modulo: "desempeno" as const },
]

const navigationEmpleado = [
  { name: "Mi Perfil", href: "/dashboard/mi-perfil", icon: User, modulo: null as any },
  { name: "Asistencia", href: "/dashboard/asistencia", icon: Clock, modulo: "asistencia" as const },
]

export function Sidebar({ rol }: { rol: RolSistema }) {
  const pathname = usePathname()

  const esEmpleado = rol === "empleado"
  
  const navigationFiltrada = esEmpleado
    ? navigationEmpleado.filter((item) => {
        if (item.modulo === null) {
          return true
        }
        return puedeAccederAModulo(rol, item.modulo)
      })
    : navigation.filter((item) => {
        if (item.href === "/dashboard") {
          return true
        }
        return puedeAccederAModulo(rol, item.modulo)
      })

  return (
    <div className="flex w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-primary">SGP</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationFiltrada.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
