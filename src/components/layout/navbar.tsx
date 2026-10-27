'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, PlusCircle, FileText, User } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Home className="h-5 w-5" />
          AlquilaCR
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/propiedades">
            <Button variant="ghost">Buscar</Button>
          </Link>
          <Link href="/propiedades/nueva">
            <Button variant="ghost">
              <PlusCircle className="mr-2 h-4 w-4" />
              Publicar
            </Button>
          </Link>
          <Link href="/contratos">
            <Button variant="ghost">
              <FileText className="mr-2 h-4 w-4" />
              Contratos
            </Button>
          </Link>
          <Link href="/perfil">
            <Button variant="ghost">
              <User className="mr-2 h-4 w-4" />
              Mi perfil
            </Button>
          </Link>
          <Link href="/login">
            <Button>Ingresar</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
