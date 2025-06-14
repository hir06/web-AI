"use client"

import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog"
import { Plane, Car, Calendar, Users, Search, Loader2, SlidersHorizontal } from "lucide-react"
import type { Destination, SearchFilters } from "./types/hotel"
import { searchHotels, getPopularDestinations } from "./data/mockData"
import { SearchFiltersComponent } from "./components/search-filters"
import { DestinationAutocomplete } from "./components/destination-autocomplete"
import { EnhancedHotelCard } from "./components/enhanced-hotel-card"

export default function App() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1,
    sortBy: "popularity",
    sortOrder: "desc",
  })

  const [hotels, setHotels] = useState<any[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Load popular destinations on mount
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await getPopularDestinations()
        setDestinations(data)
      } catch (error) {
        console.error("Failed to load destinations:", error)
      }
    }
    loadDestinations()
  }, [])

  const handleSearch = async () => {
    if (!searchFilters.destination.trim()) {
      alert("Please enter a destination")
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const results = await searchHotels(searchFilters)
      setHotels(results)
    } catch (error) {
      console.error("Search failed:", error)
      alert("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = async (newFilters: SearchFilters) => {
    setSearchFilters(newFilters)

    if (hasSearched) {
      setLoading(true)
      try {
        const results = await searchHotels(newFilters)
        setHotels(results)
      } catch (error) {
        console.error("Filter update failed:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      ...searchFilters,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      amenities: [],
      sortBy: "popularity",
      sortOrder: "desc",
    }
    handleFiltersChange(clearedFilters)
  }

  const handleDestinationClick = (destination: Destination) => {
    setSearchFilters({
      ...searchFilters,
      destination: destination.city,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Skyscanner</h1>
            </div>

            <Tabs defaultValue="hotels" className="hidden md:block">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="flights" className="flex items-center space-x-2">
                  <Plane className="w-4 h-4" />
                  <span>Flights</span>
                </TabsTrigger>
                <TabsTrigger value="hotels" className="flex items-center space-x-2">
                  <span>Hotels</span>
                </TabsTrigger>
                <TabsTrigger value="cars" className="flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span>Car hire</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              Help
            </Button>
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
              Sign in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">Find the perfect hotel</h2>
          <p className="text-xl text-white/90 mb-12">Compare prices from hundreds of travel sites and save</p>

          {/* Search Form */}
          <Card className="bg-white text-gray-900 p-6 rounded-xl shadow-xl">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <DestinationAutocomplete
                  value={searchFilters.destination}
                  onChange={(value) => setSearchFilters({ ...searchFilters, destination: value })}
                  placeholder="Where are you going?"
                  className="h-12 border-gray-300 focus:border-purple-500"
                />

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="date"
                    placeholder="Check in"
                    value={searchFilters.checkIn}
                    onChange={(e) => setSearchFilters({ ...searchFilters, checkIn: e.target.value })}
                    className="pl-10 h-12 border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="date"
                    placeholder="Check out"
                    value={searchFilters.checkOut}
                    onChange={(e) => setSearchFilters({ ...searchFilters, checkOut: e.target.value })}
                    className="pl-10 h-12 border-gray-300 focus:border-purple-500"
                  />
                </div>

                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder={`${searchFilters.guests} guests, ${searchFilters.rooms} room`}
                    className="pl-10 h-12 border-gray-300 focus:border-purple-500"
                    readOnly
                  />
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-lg font-semibold"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search hotels
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {loading ? "Searching..." : `${hotels.length} hotels found`}
                </h3>
                {searchFilters.destination && <p className="text-gray-600">in {searchFilters.destination}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  ✨ Enhanced with AI-generated images and videos for each hotel
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowFilters(true)} className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.map((hotel) => (
                  <EnhancedHotelCard key={hotel.id} hotel={hotel} onSelect={setSelectedHotel} />
                ))}
              </div>
            )}

            {!loading && hotels.length === 0 && hasSearched && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No hotels found for your search criteria.</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Destinations - Only show if no search has been made */}
      {!hasSearched && (
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Popular destinations</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((destination) => (
                <Card
                  key={destination.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleDestinationClick(destination)}
                >
                  <div className="relative">
                    <img
                      src={destination.image || "https://via.placeholder.com/300x200"}
                      alt={destination.city}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-xl font-bold">{destination.city}</h4>
                      <p className="text-sm opacity-90">{destination.country}</p>
                      <p className="text-sm font-semibold mt-1">
                        from {destination.currency}
                        {destination.averagePrice}
                      </p>
                      <p className="text-xs opacity-75">{destination.hotelCount} hotels</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Hotels</DialogTitle>
          </DialogHeader>
          <SearchFiltersComponent
            filters={searchFilters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearFilters}
          />
        </DialogContent>
      </Dialog>

      {/* Hotel Details Dialog */}
      <Dialog open={!!selectedHotel} onOpenChange={() => setSelectedHotel(null)}>
        <DialogContent className="max-w-2xl">
          {selectedHotel && (
            <div>
              <DialogHeader>
                <DialogTitle>{selectedHotel.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedHotel.image || "https://via.placeholder.com/600x300"}
                  alt={selectedHotel.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">{selectedHotel.location}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-semibold">{selectedHotel.rating}</span>
                      </div>
                      <span className="text-gray-500">({selectedHotel.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {selectedHotel.currency}
                      {selectedHotel.price}
                    </div>
                    <div className="text-gray-600">per night</div>
                  </div>
                </div>
                <p className="text-gray-700">{selectedHotel.description}</p>
                <div>
                  <h4 className="font-semibold mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Book Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                <span className="text-xl font-bold">Skyscanner</span>
              </div>
              <p className="text-gray-400 text-sm">
                Compare millions of flights, hotels and car hire deals in one search
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Partners</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Partner with us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Advertise with us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Affiliate
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Skyscanner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
