"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Printer, Download, Filter } from "lucide-react"

// Mock data - em um app real, viria do contexto ou API
const mockBookings = [
  {
    id: "1",
    professor: "Maria Silva",
    email: "maria@escola.com",
    resource: "Chromebook 01",
    type: "chromebook",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "10:00",
    purpose: "Aula de Informática - 6º Ano",
    status: "confirmed",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    professor: "João Santos",
    email: "joao@escola.com",
    resource: "Laboratório de Química",
    type: "quimica",
    date: "2024-01-15",
    startTime: "14:00",
    endTime: "16:00",
    purpose: "Experimento de Ácidos e Bases - 9º Ano",
    status: "confirmed",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    professor: "Ana Costa",
    email: "ana@escola.com",
    resource: "Laboratório de Física",
    type: "fisica",
    date: "2024-01-16",
    startTime: "10:00",
    endTime: "12:00",
    purpose: "Estudo de Movimento - 1º Ano EM",
    status: "pending",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    professor: "Carlos Lima",
    email: "carlos@escola.com",
    resource: "Chromebook 05",
    type: "chromebook",
    date: "2024-01-16",
    startTime: "15:00",
    endTime: "17:00",
    purpose: "Pesquisa Online - 8º Ano",
    status: "confirmed",
    createdAt: "2024-01-14",
  },
]

export default function RelatorioPage() {
  const { user } = useAuth()
  const [filteredBookings, setFilteredBookings] = useState(mockBookings)
  const [filters, setFilters] = useState({
    professor: "",
    resource: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  })

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // Em um app real, geraria um CSV ou PDF
    const csvContent = [
      "Professor,Email,Recurso,Data,Horário,Finalidade,Status",
      ...filteredBookings.map(
        (booking) =>
          `"${booking.professor}","${booking.email}","${booking.resource}","${booking.date}","${booking.startTime}-${booking.endTime}","${booking.purpose}","${booking.status}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-agendamentos-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const applyFilters = () => {
    let filtered = mockBookings

    if (filters.professor) {
      filtered = filtered.filter((booking) => booking.professor.toLowerCase().includes(filters.professor.toLowerCase()))
    }

    if (filters.resource !== "all") {
      filtered = filtered.filter((booking) => booking.type === filters.resource)
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((booking) => booking.status === filters.status)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((booking) => booking.date >= filters.dateFrom)
    }

    if (filters.dateTo) {
      filtered = filtered.filter((booking) => booking.date <= filters.dateTo)
    }

    setFilteredBookings(filtered)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case "chromebook":
        return "Chromebook"
      case "quimica":
        return "Lab. Química"
      case "fisica":
        return "Lab. Física"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - oculto na impressão */}
      <div className="print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatório de Agendamentos</h1>
            <p className="text-gray-600">Visualize e imprima relatórios dos agendamentos</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros - ocultos na impressão */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Professor</label>
              <Input
                placeholder="Nome do professor"
                value={filters.professor}
                onChange={(e) => setFilters({ ...filters, professor: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Recurso</label>
              <Select value={filters.resource} onValueChange={(value) => setFilters({ ...filters, resource: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os recursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os recursos</SelectItem>
                  <SelectItem value="chromebook">Chromebooks</SelectItem>
                  <SelectItem value="quimica">Lab. Química</SelectItem>
                  <SelectItem value="fisica">Lab. Física</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Data Inicial</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Data Final</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={applyFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cabeçalho do relatório - visível na impressão */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Escola - Relatório de Agendamentos</h1>
        <p className="text-gray-600">Gerado em: {new Date().toLocaleDateString("pt-BR")}</p>
        <p className="text-gray-600">Total de agendamentos: {filteredBookings.length}</p>
      </div>

      {/* Tabela de agendamentos */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:pb-4">
          <CardTitle>Agendamentos ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 print:bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recurso
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horário
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Finalidade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.professor}</div>
                        <div className="text-sm text-gray-500 print:hidden">{booking.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.resource}</div>
                      <div className="text-sm text-gray-500">{getResourceTypeLabel(booking.type)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={booking.purpose}>
                        {booking.purpose}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="print:hidden">{getStatusBadge(booking.status)}</div>
                      <div className="hidden print:block text-sm">
                        {booking.status === "confirmed"
                          ? "Confirmado"
                          : booking.status === "pending"
                            ? "Pendente"
                            : "Cancelado"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Rodapé do relatório - visível apenas na impressão */}
      <div className="hidden print:block text-center mt-8 text-sm text-gray-500">
        <p>Este relatório foi gerado automaticamente pelo Sistema de Agendamento Escolar</p>
        <p>
          Responsável: {user?.name} ({user?.email})
        </p>
      </div>
    </div>
  )
}
