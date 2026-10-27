# AlquilaCR

MVP de marketplace de alquiler a largo plazo en Costa Rica con:
- Publicaciones de propiedades
- Reseñas bidireccionales (solo tras contrato verificado)
- Expediente digital por contrato
- Historial de pagos
- Sistema de reputación/score

## Stack
- Next.js 15 (App Router) + TypeScript + TailwindCSS
- shadcn/ui
- Supabase (Auth, PostgreSQL, Storage)
- Vercel (deploy)

## Configuración

### 1) Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar migración: `supabase/migrations/001_init.sql` en SQL Editor
3. Crear bucket `rental-docs` (privado) en Storage
4. Configurar políticas de Storage (ver abajo)

### 2) Variables de entorno
Copiar `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Completar con credenciales de Supabase.

### 3) Desarrollo
```bash
npm install
npm run dev
```

### 4) Despliegue en Vercel
1. Push a GitHub
2. Importar en [vercel.com](https://vercel.com)
3. Agregar variables de entorno
4. Deploy

## Storage (Supabase)
Bucket: `rental-docs` - Privado
Políticas recomendadas: solo usuarios con contrato activo/completado pueden leer/escribir sus documentos via URLs firmadas.

## Seguridad
- RLS habilitado en todas las tablas
- Documentos en bucket privado con signed URLs
- Reseñas solo entre partes de contrato completado
- Dirección completa no se muestra públicamente
