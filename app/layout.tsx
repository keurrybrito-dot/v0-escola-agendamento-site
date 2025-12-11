import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ResourcesProvider } from "@/contexts/resources-context"

export const metadata: Metadata = {
  title: "Sistema de Agendamento Escolar",
  description: "Sistema para agendamento de recursos educativos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ResourcesProvider>{children}</ResourcesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
