"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email)
    } catch (err) {
      setError("Email não encontrado. Use um dos emails de demonstração abaixo.")
    }
  }

  const fillEmail = (email: string) => {
    setEmail(email)
    setError("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login do Professor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Selecione um email abaixo ou digite"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">Emails de Demonstração:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillEmail("joao@escola.com")}
              className="block w-full text-left px-3 py-2 text-sm bg-white border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <span className="font-medium">joao@escola.com</span>
              <span className="text-gray-500 ml-2">- João Santos (Professor)</span>
            </button>
            <button
              type="button"
              onClick={() => fillEmail("maria@escola.com")}
              className="block w-full text-left px-3 py-2 text-sm bg-white border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <span className="font-medium">maria@escola.com</span>
              <span className="text-gray-500 ml-2">- Maria Silva (Professora)</span>
            </button>
            <button
              type="button"
              onClick={() => fillEmail("admin@escola.com")}
              className="block w-full text-left px-3 py-2 text-sm bg-white border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <span className="font-medium">admin@escola.com</span>
              <span className="text-gray-500 ml-2">- Admin Escola (Administrador)</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
