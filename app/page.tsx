import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, FileText, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-blue-600">SysPersonal</h1>
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Gestión Integral de Recursos Humanos</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Sistema completo para administrar empleados, sectores, capacitaciones, asistencias y fichas médicas de tu
          organización
        </p>
        <Link href="/auth/login">
          <Button size="lg" className="text-lg">
            Acceder al Sistema
          </Button>
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h3 className="mb-12 text-center text-3xl font-bold text-gray-900">Funcionalidades Principales</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <Users className="mb-2 h-10 w-10 text-blue-600" />
              <CardTitle>Gestión de Empleados</CardTitle>
              <CardDescription>Alta, baja y modificación de datos del personal</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• CRUD completo de empleados</li>
                <li>• Asignación de roles y sectores</li>
                <li>• Relación con supervisores</li>
                <li>• Búsqueda avanzada</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="mb-2 h-10 w-10 text-blue-600" />
              <CardTitle>Capacitaciones</CardTitle>
              <CardDescription>Registro y seguimiento de formación</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gestión de capacitaciones</li>
                <li>• Asignación a empleados</li>
                <li>• Historial completo</li>
                <li>• Reportes de formación</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-10 w-10 text-blue-600" />
              <CardTitle>Reportes y Análisis</CardTitle>
              <CardDescription>Dashboard con métricas clave</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Dashboard de desempeño</li>
                <li>• Gráficos interactivos</li>
                <li>• Exportación a Excel</li>
                <li>• Historial de cambios</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="mb-2 h-10 w-10 text-blue-600" />
              <CardTitle>Seguridad y Control</CardTitle>
              <CardDescription>Protección de datos y auditoría</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Autenticación segura</li>
                <li>• Roles y permisos</li>
                <li>• Auditoría automática</li>
                <li>• Fichas médicas protegidas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="mx-auto max-w-2xl border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl">¿Listo para comenzar?</CardTitle>
            <CardDescription className="text-base">
              Accede al sistema con tus credenciales y comienza a gestionar tu personal de manera eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              <Button size="lg">Iniciar Sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>SysPersonal - Sistema de Gestión de Personal</p>
          <p className="mt-2">Universidad Tecnológica Nacional - Facultad Regional Tucumán</p>
        </div>
      </footer>
    </div>
  )
}
