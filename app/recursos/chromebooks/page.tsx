"use client"

import { useAuth } from "@/contexts/auth-context"
import { useResources } from "@/contexts/resources-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Monitor, Battery, HardDrive, Cpu } from "lucide-react"

export default function ChromebooksPage() {
  const { user, isLoading } = useAuth()
  const { getResourcesByType } = useResources()
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

  const chromebooks = getResourcesByType("chromebook")
  const availableCount = chromebooks.filter((cb) => cb.available).length
  const totalCount = chromebooks.length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chromebooks</h1>
            <p className="text-gray-600 mt-2">
              {availableCount} de {totalCount} Chromebooks disponíveis
            </p>
          </div>
          <Button>Agendar Chromebooks</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chromebooks.slice(0, 12).map((chromebook) => (
            <Card key={chromebook.id} className={chromebook.available ? "" : "opacity-60"}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    {chromebook.name}
                  </CardTitle>
                  <Badge variant={chromebook.available ? "default" : "secondary"}>
                    {chromebook.available ? "Disponível" : "Em uso"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{chromebook.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="h-4 w-4 text-gray-500" />
                    <span>{chromebook.specifications?.["Modelo"]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    <span>
                      {chromebook.specifications?.["RAM"]} RAM, {chromebook.specifications?.["Armazenamento"]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Battery className="h-4 w-4 text-gray-500" />
                    <span>{chromebook.specifications?.["Bateria"]}</span>
                  </div>
                </div>

                <Button
                  variant={chromebook.available ? "default" : "secondary"}
                  size="sm"
                  className="w-full"
                  disabled={!chromebook.available}
                >
                  {chromebook.available ? "Agendar" : "Indisponível"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {chromebooks.length > 12 && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Mostrando 12 de {chromebooks.length} Chromebooks</p>
            <Button variant="outline">Ver todos os Chromebooks</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
