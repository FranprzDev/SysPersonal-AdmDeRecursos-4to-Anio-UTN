"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface EmpleadosPorSectorChartProps {
  data: { sector: string; empleados: number }[]
}

const COLORS = ["#2563eb", "#7c3aed", "#dc2626", "#059669", "#ea580c", "#0891b2", "#be185d", "#9333ea"]

export function EmpleadosPorSectorChart({ data }: EmpleadosPorSectorChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ sector, empleados }) => `${sector}: ${empleados}`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="empleados"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
