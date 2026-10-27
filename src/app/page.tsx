import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Shield, FileText, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Alquila con confianza en Costa Rica</h1>
        <p className="text-xl text-gray-600 mb-8">
          Reseñas bidireccionales, expediente digital y reputación verificada
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/propiedades">
            <Button size="lg">
              <Search className="mr-2 h-5 w-5" />
              Buscar propiedades
            </Button>
          </Link>
          <Link href="/propiedades/nueva">
            <Button size="lg" variant="outline">
              Publicar propiedad
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-blue-600" />
            <CardTitle>Reputación verificada</CardTitle>
            <CardDescription>
              Solo reseñas entre personas con contrato verificado
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 mb-2 text-green-600" />
            <CardTitle>Expediente digital</CardTitle>
            <CardDescription>
              Contrato, documentos, recibos y acta en un solo lugar
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Star className="h-8 w-8 mb-2 text-yellow-600" />
            <CardTitle>Score dual</CardTitle>
            <CardDescription>
              Tanto inquilinos como propietarios tienen reputación
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Search className="h-8 w-8 mb-2 text-purple-600" />
            <CardTitle>Transparente</CardTitle>
            <CardDescription>
              Toma decisiones informadas con historial verificable
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Empieza ahora</h2>
        <p className="text-gray-600 mb-6">
          Forma parte de la comunidad de alquiler más confiable de Costa Rica
        </p>
        <Link href="/signup">
          <Button size="lg">Crear cuenta gratis</Button>
        </Link>
      </section>
    </div>
  )
}
