'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, LogOut, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventario", href: "/inventory", icon: Package },
  ]

  if (pathname.startsWith("/auth")) return null

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-black text-2xl text-blue-600">
            <FlaskConical className="w-8 h-8" />
            <span>LÍA</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
           <Button 
             variant="ghost" 
             size="sm" 
             className="text-slate-500 hover:text-red-600 hover:bg-red-50"
             onClick={() => signOut({ callbackUrl: "/auth/signin" })}
           >
             <LogOut className="w-4 h-4 mr-2" />
             Salir
           </Button>
        </div>
      </div>
    </nav>
  )
}
