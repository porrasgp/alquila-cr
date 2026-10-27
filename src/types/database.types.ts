export type UserRole = 'owner' | 'tenant' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  verified_identity_at: string | null
  avatar_url: string | null
  reputation_score_cached: number
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  owner_id: string
  title: string
  description: string
  price_cr: number
  currency: string
  province: string
  canton: string
  district: string
  address_details: string | null
  beds: number
  baths: number
  area_m2: number | null
  amenities: string[]
  status: 'draft' | 'published' | 'unpublished' | 'rented'
  lat: number | null
  lng: number | null
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  property_id: string
  owner_id: string
  tenant_id: string
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed'
  start_date: string
  end_date: string
  rent_amount: number
  deposit_amount: number
  contract_doc_path: string | null
  acta_path: string | null
  terms_snapshot: any
  verified_at: string | null
  owner_accepted_at: string | null
  tenant_accepted_at: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  contract_id: string
  uploaded_by: string
  type: 'cedula' | 'contract' | 'receipt' | 'acta' | 'other'
  storage_key: string
  mime_type: string
  visibility: 'parties_only'
  uploaded_at: string
}

export interface Payment {
  id: string
  contract_id: string
  amount: number
  currency: string
  paid_at: string | null
  method: string | null
  receipt_doc_id: string | null
  marked_by: string
  status: 'pending' | 'paid' | 'verified' | 'rejected'
  notes: string | null
  created_at: string
}

export interface Review {
  id: string
  contract_id: string
  author_id: string
  target_id: string
  type: 'tenant_to_owner' | 'owner_to_tenant'
  rating: number
  comment: string
  is_visible: boolean
  moderated_by: string | null
  moderated_at: string | null
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  target_type: 'property' | 'user' | 'review' | 'contract'
  target_id: string
  reason: string
  details: string
  status: 'open' | 'in_review' | 'resolved' | 'dismissed'
  handled_by: string | null
  handled_at: string | null
  created_at: string
}
