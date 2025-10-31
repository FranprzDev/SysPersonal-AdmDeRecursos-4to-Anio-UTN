import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Building2, Users, GraduationCap, Award, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EmpleadoProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const dni = decodeURIComponent(params.id)

  const { data: empleado } = await supabase
    .from("empleados")
    .select("*")
    .eq("dni", dni)
    .single()

  if (!empleado) {
    notFound()
  }

  const { data: sector } = await supabase
    .from("sectores")
    .select("*")
    .eq("id_sector", empleado.id_sector)
    .single()

  const { data: supervisor } = await supabase
    .from("empleados")
    .select("dni, nombre, apellido")
    .eq("dni", empleado.dni_supervisor)
    .single()

  const { data: capacitaciones } = await supabase
    .from("empleado_capacitacion")
    .select(
      `
      *,
      capacitacion:capacitaciones(*)
    `
    )
    .eq("dni_empleado", dni)

  const { data: roles } = await supabase
    .from("empleado_rol")
    .select(
      `
      *,
      rol:roles(*)
    `
    )
    .eq("dni_empleado", dni)

  const { data: asistencias } = await supabase
    .from("asistencias")
    .select("*")
    .eq("dni_empleado", dni)
    .order("fecha", { ascending: false })

  const { count: totalAsistencias } = await supabase
    .from("asistencias")
    .select("*", { count: "exact", head: true })
    .eq("dni_empleado", dni)

  const hoy = new Date()
  const mesActual = hoy.getMonth()
  const añoActual = hoy.getFullYear()
  const inicioMes = new Date(añoActual, mesActual, 1).toISOString().split("T")[0]

  const { count: asistenciasMes } = await supabase
    .from("asistencias")
    .select("*", { count: "exact", head: true })
    .eq("dni_empleado", dni)
    .gte("fecha", inicioMes)

  const { count: asistenciasUltimos30Dias } = await supabase
    .from("asistencias")
    .select("*", { count: "exact", head: true })
    .eq("dni_empleado", dni)
    .gte("fecha", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

  const fechaNacimiento = empleado.fecha_nacimiento
    ? new Date(empleado.fecha_nacimiento)
    : null
  const edad = fechaNacimiento
    ? hoy.getFullYear() - fechaNacimiento.getFullYear() - (hoy.getMonth() < fechaNacimiento.getMonth() || (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate()) ? 1 : 0)
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/empleados">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {empleado.nombre} {empleado.apellido}
          </h1>
          <p className="text-gray-500">Perfil del empleado</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{empleado.email}</p>
                  </div>
                </div>
                {empleado.telefono && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{empleado.telefono}</p>
                    </div>
                  </div>
                )}
                {empleado.direccion && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium">{empleado.direccion}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                    <p className="font-medium">
                      {fechaNacimiento?.toLocaleDateString("es-AR")} {edad && `(${edad} años)`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">DNI</p>
                    <p className="font-medium">{empleado.dni}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Laboral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {sector && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Sector</p>
                      <p className="font-medium">{sector.nombre_sector}</p>
                      {sector.descripcion && (
                        <p className="text-sm text-gray-500 mt-1">{sector.descripcion}</p>
                      )}
                    </div>
                  </div>
                )}
                {supervisor && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Supervisor</p>
                      <p className="font-medium">
                        {supervisor.nombre} {supervisor.apellido}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <Badge variant={empleado.activo ? "default" : "secondary"}>
                      {empleado.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {roles && roles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {roles.map((item: any) => (
                    <Badge key={item.rol.id_rol} variant="outline" className="text-sm py-1 px-3">
                      {item.rol.nombre_rol}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {capacitaciones && capacitaciones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Capacitaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {capacitaciones.map((item: any) => (
                    <div key={item.capacitacion.id_capacitacion} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold">{item.capacitacion.nombre_capacitacion}</p>
                      {item.capacitacion.institucion && (
                        <p className="text-sm text-gray-600">{item.capacitacion.institucion}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        {item.capacitacion.fecha_inicio && (
                          <span>
                            Inicio: {new Date(item.capacitacion.fecha_inicio).toLocaleDateString("es-AR")}
                          </span>
                        )}
                        {item.capacitacion.fecha_fin && (
                          <span>
                            Fin: {new Date(item.capacitacion.fecha_fin).toLocaleDateString("es-AR")}
                          </span>
                        )}
                        {item.fecha_realizacion && (
                          <span>
                            Realizada: {new Date(item.fecha_realizacion).toLocaleDateString("es-AR")}
                          </span>
                        )}
                      </div>
                      {item.capacitacion.descripcion && (
                        <p className="text-sm text-gray-600 mt-2">{item.capacitacion.descripcion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {asistencias && asistencias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Historial de Asistencias Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {asistencias.slice(0, 10).map((asistencia: any) => (
                    <div
                      key={asistencia.id_asistencia}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(asistencia.fecha).toLocaleDateString("es-AR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div className="flex gap-4 mt-1 text-sm text-gray-500">
                          {asistencia.hora_ingreso && (
                            <span>
                              Ingreso: {new Date(asistencia.hora_ingreso).toLocaleTimeString("es-AR")}
                            </span>
                          )}
                          {asistencia.hora_salida && (
                            <span>
                              Salida: {new Date(asistencia.hora_salida).toLocaleTimeString("es-AR")}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={asistencia.hora_salida ? "default" : "secondary"}>
                        {asistencia.hora_salida ? "Completo" : "En curso"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Asistencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{totalAsistencias || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Total de Asistencias</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{asistenciasMes || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Asistencias este Mes</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{asistenciasUltimos30Dias || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Últimos 30 Días</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha de creación:</span>
                <span className="font-medium">
                  {empleado.created_at
                    ? new Date(empleado.created_at).toLocaleDateString("es-AR")
                    : "-"}
                </span>
              </div>
              {empleado.updated_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Última actualización:</span>
                  <span className="font-medium">
                    {new Date(empleado.updated_at).toLocaleDateString("es-AR")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
