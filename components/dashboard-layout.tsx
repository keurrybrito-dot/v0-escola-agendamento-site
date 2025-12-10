"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Monitor,
  FlaskConical,
  Microscope,
  Settings,
  LogOut,
  Home,
  Shield,
  CalendarDays,
  Users,
  FileText,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Calendário", href: "/calendario", icon: CalendarDays },
    { name: "Agendamentos", href: "/agendamentos", icon: Calendar },
    { name: "Quem Agendou", href: "/quem-agendou", icon: Users },
    { name: "Relatório", href: "/relatorio", icon: FileText },
    { name: "Chromebooks", href: "/recursos/chromebooks", icon: Monitor },
    { name: "Lab. Química", href: "/recursos/quimica", icon: FlaskConical },
    { name: "Lab. Física", href: "/recursos/fisica", icon: Microscope },
    { name: "Configurações", href: "/configuracoes", icon: Settings },
  ]

  const adminNavigation = [
    { name: "Admin Dashboard", href: "/admin", icon: Shield },
    { name: "Gerenciar Agendamentos", href: "/admin/agendamentos", icon: Calendar },
    { name: "Gerenciar Recursos", href: "/admin/recursos", icon: Settings },
  ]

  const allNavigation = user?.role === "admin" ? [...navigation, ...adminNavigation] : navigation

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">Agendamento Escolar</h1>
          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="hidden lg:flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Agendamento Escolar</h1>
        </div>

        <div className="lg:hidden h-16"></div>

        <nav className="mt-6 px-3 pb-24">
          {allNavigation.map((item) => {
            const isActive = pathname === item.href
            const isAdminItem = item.href.startsWith("/admin")

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? isAdminItem
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                user?.role === "admin" ? "bg-red-600" : "bg-blue-600",
              )}
            >
              <span className="text-sm font-medium text-white">{user?.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email} • {user?.role === "admin" ? "Administrador" : "Professor"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
