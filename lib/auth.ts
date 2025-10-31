import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export interface User {
  id_usuario: number
  email: string
  rol_sistema: "admin" | "rrhh" | "supervisor"
  dni_empleado: string | null
}

export async function login(email: string, password: string): Promise<User | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .eq("activo", true)
    .single()

  if (error || !data) {
    return null
  }

  return data as User
}

export async function setSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("user_session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("user_session")

  if (!session) {
    return null
  }

  try {
    return JSON.parse(session.value) as User
  } catch {
    return null
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
}

export async function requireAuth() {
  const user = await getSession()
  if (!user) {
    throw new Error("No autenticado")
  }
  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.rol_sistema)) {
    throw new Error("No autorizado")
  }
  return user
}
