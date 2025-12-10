"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Monitor, FlaskConical, Microscope, Search, Filter } from "lucide-react"
import { useState } from "react"

// Mock data para demonstração
const allBookings = [
  {
    id: "1",
    resourceType: "chromebook",
    resourceName: "Chromebook 15",
    teacherName: "Prof. Maria Silva",
    teacherEmail: "maria.silva@escola.com",
    date: "2024-01-15",
    startTime: "08:00",
    endTime: "10:00",
    purpose: "Aula de Informática - 7º Ano",
    status: "confirmed",
  },
  {
    id: "2",
    resourceType: "lab-quimica",
    resourceName: "Laboratório de Química",
    teacherName: "Prof. João Santos",
    teacherEmail: "joao.santos@escola.com",
    date: "2024-01-15",
    startTime: "10:30",
    endTime: "12:00",
    purpose: "Experimento de Ácidos e Bases - 9º Ano",
    status: "confirmed",
  },
  {
    id: "3",
    resourceType: "chromebook",
    resourceName: "Chromebook 08",
    teacherName: "Prof. Ana Costa",
    teacherEmail: "ana.costa@escola.com",
    date: "2024-01-16",
    startTime: "14:00",
    endTime: "15:30",
    purpose: "Pesquisa Online - 8º Ano",
    status: "pending",
  },
  {
    id: "4",
    resourceType: "lab-fisica",
    resourceName: "Laboratório de Física",
    teacherName: "Prof. Carlos Oliveira",
    teacherEmail: "carlos.oliveira@escola.com",
    date: "2024-01-16",
    startTime: "09:00",
    endTime: "10:30",
    purpose: "Experimento de Óptica - 1º Ano EM",
    status: "confirmed",
  },
  {
    id: "5",
    resourceType: "chromebook",
    resourceName: "Chromebook 22",
    teacherName: "Prof. Lucia Ferreira",
    teacherEmail: "lucia.ferreira@escola.com",
    date: "2024-01-17",
    startTime: "13:00",
    endTime: "14:30",
    purpose: "Apresentação de Trabalhos - 6º Ano",
    status: "confirmed",
  },
]

const getResourceIcon = (type: string) => {
  switch (type) {
    case "chromebook":
      return Monitor
    case "lab-quimica":
      return FlaskConical
    case "lab-fisica":
      return Microscope
    default:
      return Monitor
  }
}

const getResourceColor = (type: string) => {
  switch (type) {
    case "chromebook":
      return "bg-blue-100 text-blue-800"
    case "lab-quimica":
      return "bg-green-100 text-green-800"
    case "lab-fisica":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confirmado"
    case "pending":
      return "Pendente"
    case "cancelled":
      return "Cancelado"
    default:
      return "Desconhecido"
  }
}

export default function QuemAgendouPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch =
      booking.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || booking.resourceType === filterType
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  // Agrupar por data
  const bookingsByDate = filteredBookings.reduce(
    (acc, booking) => {
      const date = booking.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(booking)
      return acc
    },
    {} as Record<string, typeof allBookings>,
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quem Agendou</h1>
          <p className="text-gray-600 mt-2">Visualize todos os agendamentos realizados pelos professores</p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Professor, recurso ou finalidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Recurso</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os recursos</SelectItem>
                    <SelectItem value="chromebook">Chromebooks</SelectItem>
                    <SelectItem value="lab-quimica">Lab. Química</SelectItem>
                    <SelectItem value="lab-fisica">Lab. Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de agendamentos por data */}
        <div className="space-y-6">
          {Object.keys(bookingsByDate).length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-gray-600">Tente ajustar os filtros para ver mais resultados.</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(bookingsByDate)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, bookings]) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900 capitalize">{formatDate(date)}</h2>
                    <Badge variant="secondary">{bookings.length} agendamento(s)</Badge>
                  </div>

                  <div className="grid gap-4">
                    {bookings
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((booking) => {
                        const ResourceIcon = getResourceIcon(booking.resourceType)
                        return (
                          <Card key={booking.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                  <div className={`p-2 rounded-lg ${getResourceColor(booking.resourceType)}`}>
                                    <ResourceIcon className="h-5 w-5" />
                                  </div>

                                  <div className="space-y-2">
                                    <div>
                                      <h3 className="font-semibold text-gray-900">{booking.resourceName}</h3>
                                      <p className="text-sm text-gray-600">{booking.purpose}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>{booking.teacherName}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          {booking.startTime} - {booking.endTime}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <Badge className={getStatusColor(booking.status)}>
                                  {getStatusText(booking.status)}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
