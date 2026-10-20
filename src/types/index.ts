export type ProductCategory = 'ai' | 'edit' | 'rating' | 'streaming'
export type ProductStockStatus = 'ready' | 'limited' | 'preorder' | 'empty'

export interface ProductVariant {
  id: string
  duration: string
  price: number
  originalPrice?: number
  garansi?: string
  popular?: boolean
}

export interface ProductItem {
  id: string
  name: string
  category: ProductCategory
  categoryLabel: string
  accountType: 'Private' | 'Shared' | 'Invite Link' | 'Family Head' | 'Jasa / Service' | string
  duration: string
  price: number
  originalPrice?: number
  variants?: ProductVariant[]
  garansi?: string
  stockStatus: ProductStockStatus
  stockCount?: number
  badge?: string
  features: string[]
  iconName: string
  logo?: string
  popular?: boolean
  description: string
  notes?: string
}

export type ServiceCategory = 'landing-page' | 'web-dinamis' | 'apk-offline' | 'custom-web' | 'tugas-akhir'

export interface ServiceItem {
  id: string
  name: string
  category: ServiceCategory
  categoryLabel: string
  startingPrice: number
  priceDisplay?: string
  maintenanceWarranty?: string
  timeline: string
  tagline: string
  deliverables: string[]
  advantages?: string[]
  techStack?: string[]
  badge?: string
  iconName: string
  recommended?: boolean
  suitableFor: string
}

export interface PortfolioItem {
  id: string
  title: string
  type: string
  category: 'mobile' | 'web' | 'system'
  description: string
  metrics: string
  techStack: string[]
  imageSvg?: string
  caseStudyKeyPoints: string[]
  clientType: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: 'all' | 'digital' | 'dev' | 'payment'
}

export interface StoreInfo {
  brandName: string
  tagline: string
  founder: string
  founderWebsite?: string
  whatsappNumber: string
  whatsappDisplay: string
  email: string
  githubUrl: string
  operationalHours: string
  garansiDescription: string
}

export interface CheckoutPayload {
  itemType: 'product' | 'service'
  itemId: string
  itemName: string
  itemVariantOrCategory: string
  priceDisplay: string
  customerName: string
  notes?: string
}
