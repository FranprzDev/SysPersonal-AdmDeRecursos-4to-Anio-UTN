"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Empleados", href: "/dashboard/empleados", icon: Users },
  { name: "Sectores", href: "/dashboard/sectores", icon: Building2 },
  { name: "Roles", href: "/dashboard/roles", icon: Briefcase },
  { name: "Capacitaciones", href: "/dashboard/capacitaciones", icon: GraduationCap },
  { name: "Asistencia", href: "/dashboard/asistencia", icon: Clock },
  { name: "Fichas Médicas", href: "/dashboard/fichas-medicas", icon: Heart },
  { name: "Reportes", href: "/dashboard/reportes", icon: FileText },
  { name: "Historial", href: "/dashboard/historial", icon: History },
  { name: "Desempeño", href: "/dashboard/desempeno", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-primary">SGP</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
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
