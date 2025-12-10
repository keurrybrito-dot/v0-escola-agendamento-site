"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, GraduationCap } from "lucide-react"

interface BookingFormProps {
  onSuccess?: () => void
  preSelectedDate?: string | null // Added prop for pre-selected date from calendar
}

export function BookingForm({ onSuccess, preSelectedDate }: BookingFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    recurso: "",
    date: "",
    startTime: "",
    endTime: "",
    serie: "",
    purpose: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (preSelectedDate) {
      setFormData((prev) => ({ ...prev, date: preSelectedDate }))
    }
  }, [preSelectedDate])

  const seriesEscolares = [
    { value: "6ano", label: "6º Ano" },
    { value: "7ano", label: "7º Ano" },
    { value: "8ano", label: "8º Ano" },
    { value: "9ano", label: "9º Ano" },
    { value: "1ano-em", label: "1º Ano EM" },
    { value: "2ano-em", label: "2º Ano EM" },
    { value: "3ano-em", label: "3º Ano EM" },
    { value: "1ano-epti", label: "1º Ano EPTI" },
    { value: "2ano-epti", label: "2º Ano EPTI" },
    { value: "3ano-epti", label: "3º Ano EPTI" },
  ]

  const timeSlots = [
    // Turno Matutino (07:00 - 12:20)
    "07:00",
    "07:40",
    "08:20",
    "09:00",
    "09:30",
    "09:45",
    "10:25",
    "11:05",
    "11:45",
    "12:20",

    // Turno Vespertino (13:00 - 17:30)
    "13:00",
    "13:40",
    "14:20",
    "15:00",
    "15:30",
    "15:45",
    "16:25",
    "17:05",
    "17:30",

    // Turno Noturno (19:00 - 22:30)
    "19:00",
    "19:40",
    "20:20",
    "21:00",
    "21:30",
    "21:45",
    "22:25",
    "22:30",
  ]

  const recursosDisponiveis = [
    { value: "chromebooks", label: "Chromebooks" },
    { value: "lab-quimica", label: "Laboratório de Química" },
    { value: "lab-fisica", label: "Laboratório de Física" },
    { value: "lab-informatica", label: "Laboratório de Informática" },
    { value: "projetor", label: "Projetor" },
    { value: "caixa-som", label: "Caixa de Som" },
    { value: "notebook", label: "Notebook" },
    { value: "tablet", label: "Tablet" },
    { value: "camera-digital", label: "Câmera Digital" },
    { value: "microscópio", label: "Microscópio" },
    { value: "quadro-interativo", label: "Quadro Interativo" },
    { value: "outro", label: "Outro (especificar na finalidade)" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    setShowSuccess(false)

    try {
      if (
        !formData.recurso ||
        !formData.date ||
        !formData.startTime ||
        !formData.endTime ||
        !formData.serie ||
        !formData.purpose
      ) {
        throw new Error("Todos os campos são obrigatórios")
      }

      if (formData.startTime >= formData.endTime) {
        throw new Error("O horário de início deve ser anterior ao horário de fim")
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setShowSuccess(true)
      setFormData({
        recurso: "",
        date: "",
        startTime: "",
        endTime: "",
        serie: "",
        purpose: "",
      })
      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar agendamento")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-green-800 font-medium">
            Agendamento confirmado com sucesso! Seu recurso foi reservado.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="recurso" className="text-sm font-medium">
          Recurso a ser Agendado
        </Label>
        <Select
          value={formData.recurso}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, recurso: value }))}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Selecione o recurso" />
          </SelectTrigger>
          <SelectContent>
            {recursosDisponiveis.map((recurso) => (
              <SelectItem key={recurso.value} value={recurso.value}>
                {recurso.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="date" className="text-sm font-medium">
            Data
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split("T")[0]}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serie" className="text-sm font-medium">
            Série/Ano
          </Label>
          <Select value={formData.serie} onValueChange={(value) => setFormData((prev) => ({ ...prev, serie: value }))}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Selecione a série" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Ensino Fundamental</div>
              {seriesEscolares.slice(0, 4).map((serie) => (
                <SelectItem key={serie.value} value={serie.value}>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {serie.label}
                  </div>
                </SelectItem>
              ))}
              <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Ensino Médio</div>
              {seriesEscolares.slice(4, 7).map((serie) => (
                <SelectItem key={serie.value} value={serie.value}>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {serie.label}
                  </div>
                </SelectItem>
              ))}
              <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Técnico em Informática</div>
              {seriesEscolares.slice(7).map((serie) => (
                <SelectItem key={serie.value} value={serie.value}>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {serie.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm font-medium">
            Horário de Início
          </Label>
          <Select
            value={formData.startTime}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, startTime: value }))}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Início" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-sm font-medium">
            Horário de Fim
          </Label>
          <Select
            value={formData.endTime}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, endTime: value }))}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Fim" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time} disabled={time <= formData.startTime}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose" className="text-sm font-medium">
          Finalidade do Uso
        </Label>
        <Textarea
          id="purpose"
          placeholder="Descreva como você pretende usar o recurso (ex: aula prática de química, pesquisa online, apresentação de projeto...)"
          value={formData.purpose}
          onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
          rows={3}
          className="resize-none"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
          className="w-full sm:w-auto order-2 sm:order-1"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || showSuccess}
          className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? "Confirmando..." : showSuccess ? "Confirmado!" : "Confirmar Agendamento"}
        </Button>
      </div>
    </form>
  )
}
