import type { Hotel, Destination, SearchFilters } from "../types/hotel"

// Expanded destinations list for autocomplete
export const allDestinations = [
  { id: "1", name: "London", country: "United Kingdom", fullName: "London, United Kingdom" },
  { id: "2", name: "Paris", country: "France", fullName: "Paris, France" },
  { id: "3", name: "New York", country: "United States", fullName: "New York, United States" },
  { id: "4", name: "Tokyo", country: "Japan", fullName: "Tokyo, Japan" },
  { id: "5", name: "Berlin", country: "Germany", fullName: "Berlin, Germany" },
  { id: "6", name: "Dubai", country: "UAE", fullName: "Dubai, UAE" },
  { id: "7", name: "Barcelona", country: "Spain", fullName: "Barcelona, Spain" },
  { id: "8", name: "Rome", country: "Italy", fullName: "Rome, Italy" },
  { id: "9", name: "Amsterdam", country: "Netherlands", fullName: "Amsterdam, Netherlands" },
  { id: "10", name: "Sydney", country: "Australia", fullName: "Sydney, Australia" },
  { id: "11", name: "Bangkok", country: "Thailand", fullName: "Bangkok, Thailand" },
  { id: "12", name: "Singapore", country: "Singapore", fullName: "Singapore" },
  { id: "13", name: "Los Angeles", country: "United States", fullName: "Los Angeles, United States" },
  { id: "14", name: "Miami", country: "United States", fullName: "Miami, United States" },
  { id: "15", name: "Istanbul", country: "Turkey", fullName: "Istanbul, Turkey" },
]

export const mockHotels: Hotel[] = [
  // London Hotels
  {
    id: "1",
    name: "The Ritz London",
    location: "Piccadilly, London",
    city: "London",
    country: "United Kingdom",
    rating: 4.8,
    reviewCount: 2847,
    price: 450,
    currency: "£",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
    amenities: ["Free WiFi", "Spa", "Restaurant", "Concierge", "Room Service"],
    description: "Luxury hotel in the heart of London with world-class service.",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    availability: true,
    gallery: {
      exterior: [],
      rooms: [],
      amenities: [],
      dining: [],
      facilities: [],
    },
  },
  {
    id: "2",
    name: "The Savoy",
    location: "Covent Garden, London",
    city: "London",
    country: "United Kingdom",
    rating: 4.7,
    reviewCount: 1923,
    price: 380,
    currency: "£",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Bar"],
    description: "Historic luxury hotel overlooking the Thames.",
    coordinates: { lat: 51.5101, lng: -0.1197 },
    availability: true,
    gallery: {
      exterior: [],
      rooms: [],
      amenities: [],
      dining: [],
      facilities: [],
    },
  },
  // Add more hotels...
  {
    id: "3",
    name: "Claridge's",
    location: "Mayfair, London",
    city: "London",
    country: "United Kingdom",
    rating: 4.9,
    reviewCount: 3456,
    price: 520,
    currency: "£",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop",
    amenities: ["Free WiFi", "Spa", "Restaurant", "Concierge", "Butler Service"],
    description: "Art Deco masterpiece in the heart of Mayfair.",
    coordinates: { lat: 51.5129, lng: -0.1441 },
    availability: true,
    gallery: {
      exterior: [],
      rooms: [],
      amenities: [],
      dining: [],
      facilities: [],
    },
  },
  // Paris Hotels
  {
    id: "4",
    name: "Hotel Plaza Athénée",
    location: "8th arr., Paris",
    city: "Paris",
    country: "France",
    rating: 4.9,
    reviewCount: 1923,
    price: 520,
    currency: "€",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop",
    amenities: ["Free WiFi", "Pool", "Gym", "Spa", "Restaurant"],
    description: "Elegant Parisian hotel with stunning city views.",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    availability: true,
    gallery: {
      exterior: [],
      rooms: [],
      amenities: [],
      dining: [],
      facilities: [],
    },
  },
  // New York Hotels
  {
    id: "5",
    name: "The Plaza Hotel",
    location: "Midtown, New York",
    city: "New York",
    country: "United States",
    rating: 4.7,
    reviewCount: 3456,
    price: 380,
    currency: "$",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=250&fit=crop",
    amenities: ["Free WiFi", "Concierge", "Business Center", "Fitness Center"],
    description: "Iconic New York hotel in the heart of Manhattan.",
    coordinates: { lat: 40.7589, lng: -73.9741 },
    availability: true,
    gallery: {
      exterior: [],
      rooms: [],
      amenities: [],
      dining: [],
      facilities: [],
    },
  },
]

export const mockDestinations: Destination[] = [
  {
    id: "1",
    city: "London",
    country: "United Kingdom",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop",
    averagePrice: 150,
    currency: "£",
    hotelCount: 1247,
  },
  {
    id: "2",
    city: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop",
    averagePrice: 180,
    currency: "€",
    hotelCount: 987,
  },
  {
    id: "3",
    city: "New York",
    country: "United States",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop",
    averagePrice: 200,
    currency: "$",
    hotelCount: 1567,
  },
  {
    id: "4",
    city: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop",
    averagePrice: 120,
    currency: "$",
    hotelCount: 834,
  },
]

// Function to search destinations for autocomplete
export const searchDestinations = async (query: string): Promise<typeof allDestinations> => {
  await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate API delay

  if (!query.trim()) return []

  return allDestinations
    .filter(
      (dest) =>
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.country.toLowerCase().includes(query.toLowerCase()) ||
        dest.fullName.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 8) // Limit to 8 results
}

export const searchHotels = async (filters: Partial<SearchFilters>): Promise<Hotel[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let results = [...mockHotels]

  if (filters.destination) {
    const searchTerm = filters.destination.toLowerCase().trim()
    results = results.filter(
      (hotel) =>
        hotel.city.toLowerCase().includes(searchTerm) ||
        hotel.country.toLowerCase().includes(searchTerm) ||
        hotel.location.toLowerCase().includes(searchTerm) ||
        searchTerm.includes(hotel.city.toLowerCase()) ||
        searchTerm.includes(hotel.country.toLowerCase()),
    )
  }

  if (filters.minPrice) {
    results = results.filter((hotel) => hotel.price >= filters.minPrice!)
  }
  if (filters.maxPrice) {
    results = results.filter((hotel) => hotel.price <= filters.maxPrice!)
  }

  if (filters.rating) {
    results = results.filter((hotel) => hotel.rating >= filters.rating!)
  }

  if (filters.amenities && filters.amenities.length > 0) {
    results = results.filter((hotel) => filters.amenities!.some((amenity) => hotel.amenities.includes(amenity)))
  }

  if (filters.sortBy) {
    results.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case "price":
          comparison = a.price - b.price
          break
        case "rating":
          comparison = b.rating - a.rating
          break
        case "popularity":
          comparison = b.reviewCount - a.reviewCount
          break
        default:
          comparison = 0
      }
      return filters.sortOrder === "desc" ? -comparison : comparison
    })
  }

  return results
}

export const getPopularDestinations = async (): Promise<Destination[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockDestinations
}