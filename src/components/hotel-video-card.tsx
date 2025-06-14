"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin, Play, Pause, Volume2, VolumeX, Loader2, RotateCcw } from "lucide-react"
import type { Hotel } from "../types/hotel"
import { aiVideoService, type GeneratedVideo } from "../services/ai-video-service"

interface HotelVideoCardProps {
  hotel: Hotel
  onSelect?: (hotel: Hotel) => void
}

export function HotelVideoCard({ hotel, onSelect }: HotelVideoCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [video, setVideo] = useState<GeneratedVideo | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    generateHotelVideo()
  }, [hotel.id])

  const generateHotelVideo = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const generatedVideo = await aiVideoService.generateHotelVideo(hotel.name, hotel.location, hotel.description)
      setVideo(generatedVideo)
    } catch (err) {
      console.error("Failed to generate video:", err)
      setError("Failed to generate video")
    } finally {
      setIsGenerating(false)
    }
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

  const regenerateVideo = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await generateHotelVideo()
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="relative" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
        {isGenerating ? (
          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Generating AI video...</p>
              <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Failed to generate video</p>
              <Button size="sm" variant="outline" onClick={regenerateVideo} className="text-xs">
                <RotateCcw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        ) : video ? (
          <>
            <video
              ref={videoRef}
              src={video.url}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setError("Video playback failed")}
            />

            {/* Video Controls Overlay */}
            <div
              className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute bottom-3 left-3 flex items-center space-x-2">
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
              </div>

              <div className="absolute bottom-3 right-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-black/50 hover:bg-black/70 text-white border-none h-8 w-8 p-0"
                  onClick={regenerateVideo}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* AI Generated Badge */}
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
              AI Generated
            </Badge>
          </>
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
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

        {video && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 italic">AI Prompt: {video.prompt.substring(0, 80)}...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
