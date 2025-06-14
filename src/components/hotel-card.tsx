import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin } from "lucide-react"
import Image from "next/image"
import type { Hotel } from "../types/hotel"

interface HotelCardProps {
  hotel: Hotel
  onSelect?: (hotel: Hotel) => void
}

export function HotelCard({ hotel, onSelect }: HotelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="relative">
        <Image
          src={hotel.image || "/placeholder.svg"}
          alt={hotel.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-3 right-3 bg-white/80 hover:bg-white ${
            isFavorite ? "text-red-500" : "text-gray-700"
          }`}
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        {!hotel.availability && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Not Available</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900 mb-1">{hotel.name}</h4>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{hotel.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{hotel.rating}</span>
            </div>
            <p className="text-xs text-gray-500">{hotel.reviewCount.toLocaleString()} reviews</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{hotel.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {hotel.currency}
              {hotel.price}
            </span>
            <span className="text-gray-600 text-sm ml-1">per night</span>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => onSelect?.(hotel)}
            disabled={!hotel.availability}
          >
            {hotel.availability ? "View deal" : "Unavailable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
