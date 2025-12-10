"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/database"

interface User {
  id: string
  name: string
  email: string
  role: "professor" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string) => {
    console.log("[v0] Tentando fazer login com email:", email)

    const allProfessors = db.getProfessors()
    console.log("[v0] Professores disponíveis:", allProfessors)

    const foundProfessor = db.getProfessorByEmail(email)
    console.log("[v0] Professor encontrado:", foundProfessor)

    if (!foundProfessor) {
      console.log("[v0] Email não encontrado no banco de dados")
      throw new Error("Email não encontrado")
    }

    const user: User = {
      id: foundProfessor.id,
      name: foundProfessor.name,
      email: foundProfessor.email,
      role: foundProfessor.role,
    }

    console.log("[v0] Login bem-sucedido para:", user)
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
    router.push("/dashboard")
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
