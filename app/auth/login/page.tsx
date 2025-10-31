"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error(`Error del servidor: ${text || "Respuesta no válida"}`)
      }

      if (!response.ok) {
        toast.error(data.error || "Verifica tu email y contraseña.")
        setLoading(false)
        return
      }

      toast.success("Inicio de sesión exitoso")
      await new Promise((resolve) => setTimeout(resolve, 100))
      window.location.href = "/dashboard"
    } catch (error: any) {
      toast.error(error.message || "No se pudo conectar con el servidor. Intenta nuevamente.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">SysPersonal</CardTitle>
          <CardDescription className="text-center">Ingrese sus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="password">Contraseña *</Label>
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
              <p className="font-semibold mb-2 text-blue-900">Credenciales de prueba:</p>
              <div className="space-y-1">
                <p className="text-xs text-blue-800">
                  👤 Admin: <span className="font-mono">admin@empresa.com</span> /{" "}
                  <span className="font-mono">admin123</span>
                </p>
                <p className="text-xs text-blue-800">
                  👤 RRHH: <span className="font-mono">rrhh@empresa.com</span> /{" "}
                  <span className="font-mono">rrhh123</span>
                </p>
                <p className="text-xs text-blue-800">
                  👤 Supervisor: <span className="font-mono">supervisor@empresa.com</span> /{" "}
                  <span className="font-mono">supervisor123</span>
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
