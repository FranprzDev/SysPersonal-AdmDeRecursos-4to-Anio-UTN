"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface EmpleadosPorSectorChartProps {
  data: { sector: string; empleados: number }[]
}

export function EmpleadosPorSectorChart({ data }: EmpleadosPorSectorChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sector" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="empleados" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  )
}
