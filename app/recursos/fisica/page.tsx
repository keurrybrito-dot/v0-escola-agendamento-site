"use client"

import { useAuth } from "@/contexts/auth-context"
import { useResources } from "@/contexts/resources-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Microscope, Users, MapPin, Zap, Monitor } from "lucide-react"

export default function FisicaPage() {
  const { user, isLoading } = useAuth()
  const { getResourcesByType, getBookingsForResource } = useResources()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) {
    return null
  }

  const labs = getResourcesByType("lab-fisica")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laboratório de Física</h1>
            <p className="text-gray-600 mt-2">Espaços equipados para experimentos físicos</p>
          </div>
          <Button>Agendar Laboratório</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {labs.map((lab) => {
            const bookings = getBookingsForResource(lab.id)
            const todayBookings = bookings.filter((b) => b.date === "2024-01-15")

            return (
              <Card key={lab.id} className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Microscope className="h-6 w-6 text-orange-600" />
                      {lab.name}
                    </CardTitle>
                    <Badge variant={lab.available ? "default" : "destructive"}>
                      {lab.available ? "Disponível" : "Ocupado"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{lab.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Até {lab.capacity} alunos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{lab.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Equipamentos e Recursos:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Microscope className="h-4 w-4" />
                        <span>{lab.specifications?.["Equipamentos"]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Zap className="h-4 w-4" />
                        <span>{lab.specifications?.["Experimentos"]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Monitor className="h-4 w-4" />
                        <span>{lab.specifications?.["Recursos"]}</span>
                      </div>
                    </div>
                  </div>

                  {!lab.available && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800 font-medium">Laboratório em uso</p>
                      <p className="text-xs text-orange-600 mt-1">
                        Este laboratório está atualmente ocupado. Verifique os horários disponíveis.
                      </p>
                    </div>
                  )}

                  {todayBookings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Agendamentos de Hoje:</h4>
                      <div className="space-y-1">
                        {todayBookings.map((booking) => (
                          <div key={booking.id} className="text-sm bg-gray-50 p-2 rounded">
                            <div className="flex justify-between">
                              <span>
                                {booking.startTime} - {booking.endTime}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {booking.status === "confirmed" ? "Confirmado" : "Pendente"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-xs mt-1">{booking.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant={lab.available ? "default" : "secondary"}
                    disabled={!lab.available}
                  >
                    {lab.available ? "Agendar Laboratório" : "Indisponível"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
