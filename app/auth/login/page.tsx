"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log("[v0] Intentando login con:", email)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("[v0] Respuesta login:", response.status, data)

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión")
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema",
      })

      await new Promise((resolve) => setTimeout(resolve, 100))

      console.log("[v0] Redirigiendo a dashboard")
      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("[v0] Error en login:", error)
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sistema de Gestión de Personal</CardTitle>
          <CardDescription className="text-center">Ingrese sus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm">
              <p className="font-semibold mb-1">Credenciales de prueba:</p>
              <p className="text-xs">Admin: admin@empresa.com / admin123</p>
              <p className="text-xs">RRHH: rrhh@empresa.com / rrhh123</p>
              <p className="text-xs">Supervisor: supervisor@empresa.com / supervisor123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
