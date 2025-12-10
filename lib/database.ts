export interface Professor {
  id: string
  name: string
  email: string
  role: "professor" | "admin"
  department?: string
}

export interface Resource {
  id: string
  name: string
  type: "chromebook" | "lab_quimica" | "lab_fisica" | "audiovisual" | "outro"
  description: string
  capacity?: number
  location?: string
  available: boolean
}

export interface Booking {
  id: string
  professorId: string
  professorName: string
  resourceId: string
  resourceName: string
  date: string
  time: string
  duration: number
  series: string
  purpose: string
  status: "pendente" | "confirmado" | "cancelado"
  createdAt: string
}

// Dados iniciais
const initialProfessors: Professor[] = [
  {
    id: "1",
    name: "João Santos",
    email: "joao@escola.com",
    role: "professor",
    department: "Matemática",
  },
  {
    id: "2",
    name: "Maria Silva",
    email: "maria@escola.com",
    role: "professor",
    department: "Química",
  },
  {
    id: "3",
    name: "Admin Escola",
    email: "admin@escola.com",
    role: "admin",
    department: "Administração",
  },
]

const initialResources: Resource[] = [
  {
    id: "1",
    name: "Chromebook Set A",
    type: "chromebook",
    description: "30 Chromebooks para sala de aula",
    capacity: 30,
    location: "Laboratório de Informática",
    available: true,
  },
  {
    id: "2",
    name: "Laboratório de Química",
    type: "lab_quimica",
    description: "Laboratório completo com equipamentos",
    capacity: 25,
    location: "Bloco B - Sala 201",
    available: true,
  },
  {
    id: "3",
    name: "Laboratório de Física",
    type: "lab_fisica",
    description: "Laboratório com equipamentos de física",
    capacity: 25,
    location: "Bloco B - Sala 301",
    available: true,
  },
]

const initialBookings: Booking[] = [
  {
    id: "1",
    professorId: "1",
    professorName: "João Santos",
    resourceId: "1",
    resourceName: "Chromebook Set A",
    date: "2024-01-15",
    time: "08:20",
    duration: 40,
    series: "1º Ano EM",
    purpose: "Aula de programação básica",
    status: "confirmado",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    professorId: "2",
    professorName: "Maria Silva",
    resourceId: "2",
    resourceName: "Laboratório de Química",
    date: "2024-01-16",
    time: "14:20",
    duration: 40,
    series: "2º Ano EM",
    purpose: "Experimento de reações químicas",
    status: "confirmado",
    createdAt: "2024-01-11T14:30:00Z",
  },
]

// Funções do banco de dados simulado
class Database {
  private static instance: Database
  private professors: Professor[] = []
  private resources: Resource[] = []
  private bookings: Booking[] = []
  private isInitialized = false

  constructor() {
    this.professors = initialProfessors
    this.resources = initialResources
    this.bookings = initialBookings
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  private ensureInitialized() {
    if (!this.isInitialized && typeof window !== "undefined") {
      this.loadData()
      this.isInitialized = true
    }
  }

  private loadData() {
    console.log("[v0] Carregando dados do banco...")

    try {
      // Carregar dados do localStorage ou usar dados iniciais
      const savedProfessors = localStorage.getItem("escola_professors")
      const savedResources = localStorage.getItem("escola_resources")
      const savedBookings = localStorage.getItem("escola_bookings")

      this.professors = savedProfessors ? JSON.parse(savedProfessors) : initialProfessors
      this.resources = savedResources ? JSON.parse(savedResources) : initialResources
      this.bookings = savedBookings ? JSON.parse(savedBookings) : initialBookings

      console.log("[v0] Professores carregados:", this.professors.length)
      console.log(
        "[v0] Emails disponíveis:",
        this.professors.map((p) => p.email),
      )

      // Se não há dados salvos, salvar os dados iniciais
      if (!savedProfessors || !savedResources || !savedBookings) {
        console.log("[v0] Salvando dados iniciais...")
        this.saveData()
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar dados:", error)
      this.professors = initialProfessors
      this.resources = initialResources
      this.bookings = initialBookings
    }
  }

  private saveData() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("escola_professors", JSON.stringify(this.professors))
        localStorage.setItem("escola_resources", JSON.stringify(this.resources))
        localStorage.setItem("escola_bookings", JSON.stringify(this.bookings))
      } catch (error) {
        console.error("[v0] Erro ao salvar dados:", error)
      }
    }
  }

  // Professores
  getProfessors(): Professor[] {
    this.ensureInitialized()
    return this.professors
  }

  getProfessorByEmail(email: string): Professor | undefined {
    this.ensureInitialized()
    return this.professors.find((p) => p.email === email)
  }

  // Recursos
  getResources(): Resource[] {
    this.ensureInitialized()
    return this.resources
  }

  getResourceById(id: string): Resource | undefined {
    this.ensureInitialized()
    return this.resources.find((r) => r.id === id)
  }

  // Agendamentos
  getBookings(): Booking[] {
    this.ensureInitialized()
    return this.bookings
  }

  getBookingsByDate(date: string): Booking[] {
    this.ensureInitialized()
    return this.bookings.filter((b) => b.date === date)
  }

  getBookingsByProfessor(professorId: string): Booking[] {
    this.ensureInitialized()
    return this.bookings.filter((b) => b.professorId === professorId)
  }

  createBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    this.bookings.push(newBooking)
    this.saveData()
    return newBooking
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const index = this.bookings.findIndex((b) => b.id === id)
    if (index === -1) return null

    this.bookings[index] = { ...this.bookings[index], ...updates }
    this.saveData()
    return this.bookings[index]
  }

  deleteBooking(id: string): boolean {
    const index = this.bookings.findIndex((b) => b.id === id)
    if (index === -1) return false

    this.bookings.splice(index, 1)
    this.saveData()
    return true
  }

  // Verificar disponibilidade
  isResourceAvailable(resourceId: string, date: string, time: string): boolean {
    this.ensureInitialized()
    return !this.bookings.some(
      (b) => b.resourceId === resourceId && b.date === date && b.time === time && b.status !== "cancelado",
    )
  }
}

export const db = Database.getInstance()
