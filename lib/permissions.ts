export type RolSistema = "admin" | "rrhh" | "supervisor" | "empleado"

export interface Permisos {
  empleados: {
    ver: boolean
    crear: boolean
    editar: boolean
    eliminar: boolean
  }
  sectores: {
    ver: boolean
    crear: boolean
    editar: boolean
    eliminar: boolean
  }
  roles: {
    ver: boolean
    crear: boolean
    editar: boolean
    eliminar: boolean
  }
  capacitaciones: {
    ver: boolean
    crear: boolean
    editar: boolean
    eliminar: boolean
  }
  asistencia: {
    ver: boolean
    crear: boolean
  }
  fichasMedicas: {
    ver: boolean
    crear: boolean
    editar: boolean
    eliminar: boolean
  }
  reportes: {
    ver: boolean
  }
  historial: {
    ver: boolean
  }
  desempeno: {
    ver: boolean
  }
}

export function getPermisosPorRol(rol: RolSistema): Permisos {
  switch (rol) {
    case "admin":
      return {
        empleados: { ver: true, crear: true, editar: true, eliminar: true },
        sectores: { ver: true, crear: true, editar: true, eliminar: true },
        roles: { ver: true, crear: true, editar: true, eliminar: true },
        capacitaciones: { ver: true, crear: true, editar: true, eliminar: true },
        asistencia: { ver: true, crear: true },
        fichasMedicas: { ver: true, crear: true, editar: true, eliminar: true },
        reportes: { ver: true },
        historial: { ver: true },
        desempeno: { ver: true },
      }
    case "rrhh":
      return {
        empleados: { ver: true, crear: true, editar: true, eliminar: true },
        sectores: { ver: true, crear: false, editar: false, eliminar: false },
        roles: { ver: true, crear: false, editar: false, eliminar: false },
        capacitaciones: { ver: true, crear: true, editar: true, eliminar: true },
        asistencia: { ver: false, crear: false },
        fichasMedicas: { ver: true, crear: true, editar: true, eliminar: true },
        reportes: { ver: true },
        historial: { ver: true },
        desempeno: { ver: true },
      }
    case "supervisor":
      return {
        empleados: { ver: true, crear: false, editar: false, eliminar: false },
        sectores: { ver: true, crear: false, editar: false, eliminar: false },
        roles: { ver: false, crear: false, editar: false, eliminar: false },
        capacitaciones: { ver: true, crear: true, editar: true, eliminar: true },
        asistencia: { ver: false, crear: false },
        fichasMedicas: { ver: true, crear: false, editar: false, eliminar: false },
        reportes: { ver: true },
        historial: { ver: true },
        desempeno: { ver: true },
      }
    case "empleado":
      return {
        empleados: { ver: false, crear: false, editar: false, eliminar: false },
        sectores: { ver: false, crear: false, editar: false, eliminar: false },
        roles: { ver: false, crear: false, editar: false, eliminar: false },
        capacitaciones: { ver: false, crear: false, editar: false, eliminar: false },
        asistencia: { ver: true, crear: true },
        fichasMedicas: { ver: false, crear: false, editar: false, eliminar: false },
        reportes: { ver: false },
        historial: { ver: false },
        desempeno: { ver: false },
      }
    default:
      return {
        empleados: { ver: false, crear: false, editar: false, eliminar: false },
        sectores: { ver: false, crear: false, editar: false, eliminar: false },
        roles: { ver: false, crear: false, editar: false, eliminar: false },
        capacitaciones: { ver: false, crear: false, editar: false, eliminar: false },
        asistencia: { ver: false, crear: false },
        fichasMedicas: { ver: false, crear: false, editar: false, eliminar: false },
        reportes: { ver: false },
        historial: { ver: false },
        desempeno: { ver: false },
      }
  }
}

export function puedeAccederAModulo(rol: RolSistema, modulo: keyof Permisos): boolean {
  const permisos = getPermisosPorRol(rol)
  return permisos[modulo].ver
}

