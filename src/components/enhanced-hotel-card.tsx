import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Star, Heart, MapPin, Play, Pause, Volume2, VolumeX, Loader2, Images, Eye } from "lucide-react"
import type { Hotel } from "../types/hotel"
import { aiMediaService, type GeneratedMedia } from "../services/ai-media-service"
import { HotelGallery } from "./hotel-gallery"

interface EnhancedHotelCardProps {
  hotel: Hotel
  onSelect?: (hotel: Hotel) => void
}

export function EnhancedHotelCard({ hotel, onSelect }: EnhancedHotelCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [media, setMedia] = useState<{
    exterior: GeneratedMedia[]
    rooms: GeneratedMedia[]
    amenities: GeneratedMedia[]
    dining: GeneratedMedia[]
    facilities: GeneratedMedia[]
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    generateHotelMedia()
  }, [hotel.id])

  const generateHotelMedia = async () => {
    setIsGenerating(true)
    try {
      const generatedMedia = await aiMediaService.generateHotelMedia(hotel.name, hotel.location)
      setMedia(generatedMedia)
    } catch (error) {
      console.error("Failed to generate media:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const allMedia = media
    ? [...media.exterior, ...media.rooms, ...media.amenities, ...media.dining, ...media.facilities]
    : []

  const currentMedia = allMedia[currentMediaIndex]

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length)
  }

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Auto-cycle through media every 5 seconds
  useEffect(() => {
    if (allMedia.length > 1 && isPlaying) {
      const interval = setInterval(nextMedia, 5000)
      return () => clearInterval(interval)
    }
  }, [allMedia.length, isPlaying, currentMediaIndex])

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div
          className="relative"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {isGenerating ? (
            <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Generating media gallery...</p>
              </div>
            </div>
          ) : currentMedia ? (
            <>
              {currentMedia.type === "image" ? (
                <img
                  src={currentMedia.url || "https://via.placeholder.com/400x250"}
                  alt={currentMedia.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              )}

              {/* Media Controls Overlay */}
              <div
                className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  {currentMedia.type === "video" && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/50 hover:bg-black/70 text-white border-none h-8 w-8 p-0"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/50 hover:bg-black/70 text-white border-none h-8 w-8 p-0"
                        onClick={toggleMute}
                      >
                        {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      </Button>
                    </>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-black/50 hover:bg-black/70 text-white border-none h-8 px-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowGallery(true)
                    }}
                  >
                    <Images className="w-3 h-3 mr-1" />
                    {allMedia.length}
                  </Button>
                </div>
              </div>

              {/* Media Type Badge */}
              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                {currentMedia.category} • {currentMedia.type}
              </Badge>

              {/* Media Counter */}
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {currentMediaIndex + 1}/{allMedia.length}
              </div>
            </>
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Loading media...</p>
            </div>
          )}

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

          {/* Media Categories Preview */}
          {media && (
            <div className="flex flex-wrap gap-1 mb-4">
              {Object.entries(media).map(([category, items]) => (
                <Badge key={category} variant="outline" className="text-xs capitalize">
                  {category} ({items.length})
                </Badge>
              ))}
            </div>
          )}

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
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowGallery(true)
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Gallery
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => onSelect?.(hotel)}
                disabled={!hotel.availability}
              >
                {hotel.availability ? "View deal" : "Unavailable"}
              </Button>
            </div>
          </div>

          {currentMedia && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic">
                Current: {currentMedia.title} • {currentMedia.prompt.substring(0, 60)}...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Modal */}
      {media && (
        <HotelGallery isOpen={showGallery} onClose={() => setShowGallery(false)} hotelName={hotel.name} media={media} />
      )}
    </>
  )
}
