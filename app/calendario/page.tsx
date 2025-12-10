"use client"

import { useAuth } from "@/contexts/auth-context"
import { useResources } from "@/contexts/resources-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookingForm } from "@/components/booking-form"

const getEasterDate = (year: number) => {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

const formatDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getBrazilianHolidays = (year: number) => {
  const holidays: { [key: string]: string } = {}

  // Feriados fixos
  holidays[`${year}-01-01`] = "Confraternização Universal"
  holidays[`${year}-04-21`] = "Tiradentes"
  holidays[`${year}-05-01`] = "Dia do Trabalhador"
  holidays[`${year}-09-07`] = "Independência do Brasil"
  holidays[`${year}-10-12`] = "Nossa Senhora Aparecida"
  holidays[`${year}-11-02`] = "Finados"
  holidays[`${year}-11-15`] = "Proclamação da República"
  holidays[`${year}-12-25`] = "Natal"

  // Carnaval (47 dias antes da Páscoa)
  const easter = getEasterDate(year)
  const carnival = new Date(easter)
  carnival.setDate(easter.getDate() - 47)
  holidays[formatDateString(carnival)] = "Carnaval"

  // Sexta-feira Santa (2 dias antes da Páscoa)
  const goodFriday = new Date(easter)
  goodFriday.setDate(easter.getDate() - 2)
  holidays[formatDateString(goodFriday)] = "Sexta-feira Santa"

  // Corpus Christi (60 dias após a Páscoa)
  const corpusChristi = new Date(easter)
  corpusChristi.setDate(easter.getDate() + 60)
  holidays[formatDateString(corpusChristi)] = "Corpus Christi"

  return holidays
}

export default function CalendarioPage() {
  const { user, isLoading } = useAuth()
  const { bookings, getResourceById } = useResources()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getBookingsForDate = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return bookings.filter((booking) => booking.date === dateString)
  }

  const getSelectedDateBookings = () => {
    if (!selectedDate) return []
    return bookings.filter((booking) => booking.date === selectedDate)
  }

  const formatDateForDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number)
    const date = new Date(year, month - 1, day) // month is 0-indexed
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
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

  const getHolidayForDate = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const holidays = getBrazilianHolidays(currentYear)
    return holidays[dateString]
  }

  const handleDateClick = (dateString: string) => {
    setSelectedDate(dateString)
  }

  const handleQuickBooking = () => {
    setIsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Calendário</h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
              Visualize seus agendamentos em formato de calendário
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl mx-4">
              <DialogHeader>
                <DialogTitle>Criar Novo Agendamento</DialogTitle>
              </DialogHeader>
              <BookingForm onSuccess={() => setIsDialogOpen(false)} preSelectedDate={selectedDate} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="hidden sm:inline">
                      {monthNames[currentMonth]} {currentYear}
                    </span>
                    <span className="sm:hidden">
                      {monthNames[currentMonth].slice(0, 3)} {currentYear}
                    </span>
                  </CardTitle>
                  <div className="flex gap-1 lg:gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2 lg:p-6">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="p-1 lg:p-2 text-center text-xs lg:text-sm font-medium text-gray-500">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.slice(0, 1)}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="p-1 lg:p-2 h-12 lg:h-20"></div>
                    }

                    const dayBookings = getBookingsForDate(day)
                    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const isSelected = selectedDate === dateString
                    const isToday =
                      new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()
                    const holiday = getHolidayForDate(day)
                    const hasBookings = dayBookings.length > 0

                    return (
                      <div
                        key={day}
                        className={`p-1 lg:p-2 h-12 lg:h-20 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-100 border-blue-300"
                            : isToday
                              ? "bg-blue-50 border-blue-200"
                              : holiday
                                ? "bg-red-50 border-red-200"
                                : hasBookings
                                  ? "bg-red-100 border-red-300 hover:bg-red-200"
                                  : "hover:bg-gray-50 border-gray-200"
                        }`}
                        onClick={() => handleDateClick(dateString)}
                      >
                        <div
                          className={`text-xs lg:text-sm font-medium mb-1 ${
                            holiday ? "text-red-600" : hasBookings ? "text-red-800" : ""
                          }`}
                        >
                          {day}
                          {hasBookings && !holiday && (
                            <span className="ml-1 w-1.5 h-1.5 bg-red-600 rounded-full inline-block"></span>
                          )}
                        </div>
                        {holiday && (
                          <div className="text-[10px] lg:text-xs text-red-600 font-medium mb-1 leading-tight break-words overflow-hidden">
                            <div className="line-clamp-2 lg:line-clamp-3">{holiday}</div>
                          </div>
                        )}
                        <div className="space-y-1">
                          {dayBookings
                            .slice(0, holiday ? (window.innerWidth < 1024 ? 0 : 1) : window.innerWidth < 1024 ? 1 : 2)
                            .map((booking) => {
                              const resource = getResourceById(booking.resourceId)
                              return (
                                <div
                                  key={booking.id}
                                  className="text-[8px] lg:text-xs px-1 py-0.5 rounded leading-tight bg-white text-red-800 border border-red-200"
                                >
                                  <div className="font-medium truncate">{booking.teacherName}</div>
                                  <div className="truncate opacity-90">{booking.resource || "Recurso"}</div>
                                </div>
                              )
                            })}
                          {dayBookings.length >
                            (holiday ? (window.innerWidth < 1024 ? 0 : 1) : window.innerWidth < 1024 ? 1 : 2) && (
                            <div className="text-xs text-red-700 font-medium">
                              <span className="hidden lg:inline">+{dayBookings.length - (holiday ? 1 : 2)} mais</span>
                              <span className="lg:hidden">+{dayBookings.length - 1}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base lg:text-lg">
                  {selectedDate ? formatDateForDisplay(selectedDate) : "Selecione uma data"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-3">
                    <Button onClick={handleQuickBooking} className="w-full mb-3" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agendar para {formatDateForDisplay(selectedDate).split(",")[0]}
                    </Button>

                    {(() => {
                      const [year, month, day] = selectedDate.split("-").map(Number)
                      const holidays = getBrazilianHolidays(year)
                      const holiday = holidays[selectedDate]

                      return holiday ? (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium text-red-700">Feriado: {holiday}</span>
                          </div>
                        </div>
                      ) : null
                    })()}

                    {getSelectedDateBookings().length === 0 ? (
                      <p className="text-gray-500 text-sm">Nenhum agendamento para esta data.</p>
                    ) : (
                      getSelectedDateBookings().map((booking) => {
                        const resource = getResourceById(booking.resourceId)
                        if (!resource) return null

                        return (
                          <div key={booking.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{resource.name}</h4>
                              <Badge
                                variant={
                                  booking.status === "confirmed"
                                    ? "default"
                                    : booking.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {booking.status === "confirmed"
                                  ? "Confirmado"
                                  : booking.status === "pending"
                                    ? "Pendente"
                                    : "Cancelado"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              {booking.startTime} - {booking.endTime}
                            </p>
                            <p className="text-xs text-gray-500">{booking.purpose}</p>
                            {user.role === "admin" && (
                              <p className="text-xs text-gray-500 mt-1">Professor: {booking.teacherName}</p>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Clique em uma data no calendário para ver os agendamentos.</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base lg:text-lg">Estatísticas do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total de Agendamentos</span>
                    <span className="font-medium">
                      {
                        bookings.filter((b) => {
                          const bookingDate = new Date(b.date)
                          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
                        }).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Confirmados</span>
                    <span className="font-medium text-green-600">
                      {
                        bookings.filter((b) => {
                          const bookingDate = new Date(b.date)
                          return (
                            bookingDate.getMonth() === currentMonth &&
                            bookingDate.getFullYear() === currentYear &&
                            b.status === "confirmed"
                          )
                        }).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pendentes</span>
                    <span className="font-medium text-yellow-600">
                      {
                        bookings.filter((b) => {
                          const bookingDate = new Date(b.date)
                          return (
                            bookingDate.getMonth() === currentMonth &&
                            bookingDate.getFullYear() === currentYear &&
                            b.status === "pending"
                          )
                        }).length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
