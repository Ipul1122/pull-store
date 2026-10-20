export interface TestimonialItem {
  id: string
  created_at?: string
  clientName: string
  orderName: string
  orderDate: string
  price: number
  priceDisplay?: string
  warranty: string
  notes: string
  imageUrl?: string
  rating?: number
  verified?: boolean
}

export const SPREADSHEET_TRANSPARENCY_URL = 'https://docs.google.com/spreadsheets/d/1v-adlXEhohFwqVToSvS36gH5eEeUwoaHSjuC6fEnV1M/edit?gid=0#gid=0'

export const INITIAL_TESTIMONIALS: TestimonialItem[] = []
