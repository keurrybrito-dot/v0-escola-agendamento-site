"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Resource {
  id: string
  name: string
  type: "chromebook" | "lab-quimica" | "lab-fisica" | "espaco"
  description: string
  capacity?: number
  location: string
  available: boolean
  specifications?: Record<string, string>
}

export interface Booking {
  id: string
  resourceId: string
  teacherName: string
  teacherEmail: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  status: "confirmed" | "pending" | "cancelled"
}

interface ResourcesContextType {
  resources: Resource[]
  bookings: Booking[]
  getResourcesByType: (type: Resource["type"]) => Resource[]
  getResourceById: (id: string) => Resource | undefined
  getBookingsForResource: (resourceId: string) => Booking[]
  isResourceAvailable: (resourceId: string, date: string, startTime: string, endTime: string) => boolean
}

const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined)

// Mock data
const mockResources: Resource[] = [
  // Chromebooks
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `chromebook-${i + 1}`,
    name: `Chromebook ${i + 1}`,
    type: "chromebook" as const,
    description: `Chromebook para uso educativo - Unidade ${i + 1}`,
    location: "Armário de Chromebooks",
    available: i < 25, // 25 disponíveis, 5 em manutenção
    specifications: {
      Modelo: "Acer Chromebook Spin 511",
      RAM: "4GB",
      Armazenamento: "32GB eMMC",
      Tela: "11.6 polegadas",
      Bateria: "Até 10 horas",
    },
  })),

  // Laboratórios
  {
    id: "lab-quimica-1",
    name: "Laboratório de Química",
    type: "lab-quimica",
    description: "Laboratório completo para experimentos de química",
    capacity: 30,
    location: "Bloco B - Sala 201",
    available: true,
    specifications: {
      Capacidade: "30 alunos",
      Equipamentos: "Bancadas, capelas, vidrarias",
      Segurança: "Chuveiro de emergência, lava-olhos",
      Recursos: "Projetor, quadro digital",
    },
  },
  {
    id: "lab-fisica-1",
    name: "Laboratório de Física",
    type: "lab-fisica",
    description: "Laboratório equipado para experimentos de física",
    capacity: 25,
    location: "Bloco C - Sala 101",
    available: false, // Ocupado conforme dashboard
    specifications: {
      Capacidade: "25 alunos",
      Equipamentos: "Bancadas, instrumentos de medição",
      Experimentos: "Mecânica, eletricidade, óptica",
      Recursos: "Projetor, sistema de som",
    },
  },
  {
    id: "lab-informatica-1",
    name: "Laboratório de Informática",
    type: "espaco",
    description: "Sala com computadores para aulas de informática",
    capacity: 40,
    location: "Bloco A - Sala 105",
    available: true,
    specifications: {
      Capacidade: "40 alunos",
      Computadores: "40 desktops",
      Software: "Office, navegadores, IDEs",
      Rede: "Internet de alta velocidade",
    },
  },
]

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    resourceId: "lab-informatica-1",
    teacherName: "Prof. Maria Silva",
    teacherEmail: "professor@escola.com",
    date: "2024-01-15",
    startTime: "14:00",
    endTime: "15:30",
    purpose: "Aula de programação básica",
    status: "confirmed",
  },
  {
    id: "booking-2",
    resourceId: "chromebook-1",
    teacherName: "Prof. Maria Silva",
    teacherEmail: "professor@escola.com",
    date: "2024-01-16",
    startTime: "09:00",
    endTime: "10:30",
    purpose: "Pesquisa online para projeto",
    status: "confirmed",
  },
]

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const [resources] = useState<Resource[]>(mockResources)
  const [bookings] = useState<Booking[]>(mockBookings)

  const getResourcesByType = (type: Resource["type"]) => {
    return resources.filter((resource) => resource.type === type)
  }

  const getResourceById = (id: string) => {
    return resources.find((resource) => resource.id === id)
  }

  const getBookingsForResource = (resourceId: string) => {
    return bookings.filter((booking) => booking.resourceId === resourceId)
  }

  const isResourceAvailable = (resourceId: string, date: string, startTime: string, endTime: string) => {
    const resource = getResourceById(resourceId)
    if (!resource || !resource.available) return false

    const resourceBookings = getBookingsForResource(resourceId)
    const conflictingBooking = resourceBookings.find((booking) => {
      if (booking.date !== date || booking.status === "cancelled") return false

      const bookingStart = booking.startTime
      const bookingEnd = booking.endTime

      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      )
    })

    return !conflictingBooking
  }

  return (
    <ResourcesContext.Provider
      value={{
        resources,
        bookings,
        getResourcesByType,
        getResourceById,
        getBookingsForResource,
        isResourceAvailable,
      }}
    >
      {children}
    </ResourcesContext.Provider>
  )
}

export function useResources() {
  const context = useContext(ResourcesContext)
  if (context === undefined) {
    throw new Error("useResources must be used within a ResourcesProvider")
  }
  return context
}
