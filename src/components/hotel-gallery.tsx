"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import type { GeneratedMedia } from "../services/ai-media-service"

interface HotelGalleryProps {
  isOpen: boolean
  onClose: () => void
  hotelName: string
  media: {
    exterior: GeneratedMedia[]
    rooms: GeneratedMedia[]
    amenities: GeneratedMedia[]
    dining: GeneratedMedia[]
    facilities: GeneratedMedia[]
  }
}

export function HotelGallery({ isOpen, onClose, hotelName, media }: HotelGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("exterior")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const currentMedia = media[activeCategory as keyof typeof media] || []
  const currentItem = currentMedia[currentIndex]

  useEffect(() => {
    setCurrentIndex(0)
  }, [activeCategory])

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % currentMedia.length)
  }

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + currentMedia.length) % currentMedia.length)
  }

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying)
  }

  if (!currentItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>{hotelName} - Gallery</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="px-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="exterior">Exterior</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="dining">Dining</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Main Media Display */}
          <div className="flex-1 relative bg-black">
            {currentItem.type === "image" ? (
              <img
                src={currentItem.url || "https://via.placeholder.com/800x600"}
                alt={currentItem.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  src={currentItem.url}
                  className="max-w-full max-h-full object-contain"
                  controls={isVideoPlaying}
                  autoPlay={isVideoPlaying}
                  muted
                  loop
                />
                {!isVideoPlaying && (
                  <Button
                    size="lg"
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 hover:bg-white/30"
                    onClick={toggleVideo}
                  >
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                )}
              </div>
            )}

            {/* Navigation Arrows */}
            {currentMedia.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevItem}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextItem}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Media Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-semibold">{currentItem.title}</h3>
                  <p className="text-sm opacity-90">{currentItem.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {currentItem.type === "video" ? "Video" : "Photo"}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    AI Generated
                  </Badge>
                </div>
              </div>
            </div>

            {/* Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {currentMedia.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="p-4 bg-gray-50">
            <div className="flex space-x-2 overflow-x-auto">
              {currentMedia.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex ? "border-purple-500 scale-105" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={item.thumbnailUrl || "https://via.placeholder.com/80x64"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
