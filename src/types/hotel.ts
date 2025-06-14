export interface Hotel {
  id: string
  name: string
  location: string
  city: string
  country: string
  rating: number
  reviewCount: number
  price: number
  currency: string
  image: string
  amenities: string[]
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  availability: boolean
  gallery: HotelGallery
}

export interface HotelGallery {
  exterior: MediaItem[]
  rooms: MediaItem[]
  amenities: MediaItem[]
  dining: MediaItem[]
  facilities: MediaItem[]
}

export interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  thumbnailUrl?: string
  title: string
  description: string
  category: string
}

export interface Destination {
  id: string
  city: string
  country: string
  image: string
  averagePrice: number
  currency: string
  hotelCount: number
}

export interface SearchFilters {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  minPrice?: number
  maxPrice?: number
  rating?: number
  amenities?: string[]
  sortBy?: "price" | "rating" | "distance" | "popularity"
  sortOrder?: "asc" | "desc"
}

export interface SearchResult {
  hotels: Hotel[]
  totalCount: number
  filters: SearchFilters
}
