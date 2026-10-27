'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function NuevaPropiedadPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Debes iniciar sesión')
      router.push('/login')
      return
    }

    const property = {
      owner_id: user.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price_cr: Number(formData.get('price_cr')),
      province: formData.get('province') as string,
      canton: formData.get('canton') as string,
      district: formData.get('district') as string,
      beds: Number(formData.get('beds')),
      baths: Number(formData.get('baths')),
      area_m2: formData.get('area_m2') ? Number(formData.get('area_m2')) : null,
      amenities: [],
      status: 'published'
    }

    const { error } = await supabase.from('properties').insert(property)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Propiedad publicada')
      router.push('/propiedades')
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Publicar nueva propiedad</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" placeholder="Casa en alquiler en..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_cr">Precio mensual (CRC)</Label>
                <Input id="price_cr" name="price_cr" type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area_m2">Área (m²)</Label>
                <Input id="area_m2" name="area_m2" type="number" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Provincia</Label>
                <Input id="province" name="province" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canton">Cantón</Label>
                <Input id="canton" name="canton" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Distrito</Label>
                <Input id="district" name="district" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="beds">Habitaciones</Label>
                <Input id="beds" name="beds" type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baths">Baños</Label>
                <Input id="baths" name="baths" type="number" required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
