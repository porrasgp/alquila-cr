'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCRC } from '@/lib/utils'
import { MapPin, Bed, Bath } from 'lucide-react'

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    setProperties(data || [])
    setLoading(false)
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Propiedades en alquiler</h1>
        <Link href="/propiedades/nueva">
          <Button>Publicar propiedad</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link key={property.id} href={`/propiedades/${property.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {property.district}, {property.canton}, {property.province}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatCRC(property.price_cr)} / mes
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {property.beds} hab
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {property.baths} baños
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {properties.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay propiedades publicadas aún
        </div>
      )}
    </div>
  )
}
