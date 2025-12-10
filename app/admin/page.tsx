"use client"

import { useAuth } from "@/contexts/auth-context"
import { useResources } from "@/contexts/resources-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Users,
  Monitor,
  FlaskConical,
  Microscope,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const { bookings, resources, getResourceById } = useResources()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  // Statistics
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length

  const totalResources = resources.length
  const availableResources = resources.filter((r) => r.available).length
  const unavailableResources = totalResources - availableResources

  const chromebooks = resources.filter((r) => r.type === "chromebook")
  const availableChromebooks = chromebooks.filter((r) => r.available).length

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(`${b.date} ${b.startTime}`).getTime() - new Date(`${a.date} ${a.startTime}`).getTime())
    .slice(0, 5)

  const stats = [
    {
      title: "Total de Agendamentos",
      value: totalBookings.toString(),
      icon: Calendar,
      color: "text-blue-600",
      change: "+12% este mês",
    },
    {
      title: "Agendamentos Pendentes",
      value: pendingBookings.toString(),
      icon: Clock,
      color: "text-yellow-600",
      change: `${pendingBookings} aguardando aprovação`,
    },
    {
      title: "Recursos Disponíveis",
      value: `${availableResources}/${totalResources}`,
      icon: CheckCircle,
      color: "text-green-600",
      change: `${Math.round((availableResources / totalResources) * 100)}% disponível`,
    },
    {
      title: "Chromebooks Ativos",
      value: `${availableChromebooks}/${chromebooks.length}`,
      icon: Monitor,
      color: "text-purple-600",
      change: `${chromebooks.length - availableChromebooks} em manutenção`,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
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
        return status
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">Gerencie agendamentos e recursos da escola</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agendamentos Recentes
                </CardTitle>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.map((booking) => {
                  const resource = getResourceById(booking.resourceId)
                  if (!resource) return null

                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{resource.name}</p>
                          <Badge variant={getStatusColor(booking.status)} className="text-xs">
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{booking.teacherName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.date).toLocaleDateString("pt-BR")} • {booking.startTime}-{booking.endTime}
                        </p>
                      </div>
                      {booking.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resource Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Status dos Recursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Chromebooks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(availableChromebooks / chromebooks.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {availableChromebooks}/{chromebooks.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Lab. Química</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      Disponível
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Microscope className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Lab. Física</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      Ocupado
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Lab. Informática</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      Disponível
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Gerenciar Professores</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Monitor className="h-6 w-6" />
                <span>Gerenciar Recursos</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                <span>Relatórios</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {(pendingBookings > 0 || unavailableResources > 0) && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Atenção Necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingBookings > 0 && (
                  <p className="text-sm text-yellow-700">• {pendingBookings} agendamento(s) aguardando aprovação</p>
                )}
                {unavailableResources > 0 && (
                  <p className="text-sm text-yellow-700">
                    • {unavailableResources} recurso(s) indisponível(is) ou em manutenção
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
