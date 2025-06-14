export interface MediaGenerationRequest {
  hotelName: string
  location: string
  category: "exterior" | "rooms" | "amenities" | "dining" | "facilities"
  type: "image" | "video"
  style?: "professional" | "lifestyle" | "architectural"
  prompt?: string
}

export interface GeneratedMedia {
  id: string
  type: "image" | "video"
  url: string
  thumbnailUrl: string
  title: string
  description: string
  category: string
  prompt: string
  status: "generating" | "completed" | "failed"
}

// Mock media URLs for different categories
const mockMediaUrls = {
  exterior: {
    images: [
      "/placeholder.svg?height=400&width=600&text=Hotel+Exterior",
      "/placeholder.svg?height=400&width=600&text=Hotel+Entrance",
      "/placeholder.svg?height=400&width=600&text=Hotel+Facade",
    ],
    videos: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    ],
  },
  rooms: {
    images: [
      "/placeholder.svg?height=400&width=600&text=Luxury+Suite",
      "/placeholder.svg?height=400&width=600&text=Standard+Room",
      "/placeholder.svg?height=400&width=600&text=Bathroom",
      "/placeholder.svg?height=400&width=600&text=Room+View",
    ],
    videos: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    ],
  },
  amenities: {
    images: [
      "/placeholder.svg?height=400&width=600&text=Swimming+Pool",
      "/placeholder.svg?height=400&width=600&text=Fitness+Center",
      "/placeholder.svg?height=400&width=600&text=Spa+Area",
      "/placeholder.svg?height=400&width=600&text=Business+Center",
    ],
    videos: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    ],
  },
  dining: {
    images: [
      "/placeholder.svg?height=400&width=600&text=Restaurant",
      "/placeholder.svg?height=400&width=600&text=Bar+Lounge",
      "/placeholder.svg?height=400&width=600&text=Room+Service",
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"],
  },
  facilities: {
    images: [
      "/placeholder.svg?height=400&width=600&text=Lobby",
      "/placeholder.svg?height=400&width=600&text=Conference+Room",
      "/placeholder.svg?height=400&width=600&text=Concierge",
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"],
  },
}

class AIMediaService {
  private cache = new Map<string, GeneratedMedia[]>()

  async generateHotelMedia(
    hotelName: string,
    location: string,
  ): Promise<{
    exterior: GeneratedMedia[]
    rooms: GeneratedMedia[]
    amenities: GeneratedMedia[]
    dining: GeneratedMedia[]
    facilities: GeneratedMedia[]
  }> {
    const cacheKey = `${hotelName}-${location}`

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!
      return this.organizeMediaByCategory(cached)
    }

    // Generate media for all categories
    const allMedia: GeneratedMedia[] = []

    for (const category of ["exterior", "rooms", "amenities", "dining", "facilities"] as const) {
      const categoryMedia = await this.generateCategoryMedia(hotelName, location, category)
      allMedia.push(...categoryMedia)
    }

    this.cache.set(cacheKey, allMedia)
    return this.organizeMediaByCategory(allMedia)
  }

  private async generateCategoryMedia(
    hotelName: string,
    location: string,
    category: keyof typeof mockMediaUrls,
  ): Promise<GeneratedMedia[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate generation time

    const media: GeneratedMedia[] = []
    const categoryData = mockMediaUrls[category]

    // Generate images
    categoryData.images.forEach((url, index) => {
      media.push({
        id: `${category}-img-${index}`,
        type: "image",
        url,
        thumbnailUrl: url,
        title: this.generateTitle(category, "image", index),
        description: this.generateDescription(hotelName, category, "image"),
        category,
        prompt: this.generatePrompt(hotelName, location, category, "image"),
        status: "completed",
      })
    })

    // Generate videos
    categoryData.videos.forEach((url, index) => {
      media.push({
        id: `${category}-vid-${index}`,
        type: "video",
        url,
        thumbnailUrl: `/placeholder.svg?height=300&width=400&text=${category}+Video`,
        title: this.generateTitle(category, "video", index),
        description: this.generateDescription(hotelName, category, "video"),
        category,
        prompt: this.generatePrompt(hotelName, location, category, "video"),
        status: "completed",
      })
    })

    return media
  }

  private organizeMediaByCategory(media: GeneratedMedia[]) {
    return {
      exterior: media.filter((m) => m.category === "exterior"),
      rooms: media.filter((m) => m.category === "rooms"),
      amenities: media.filter((m) => m.category === "amenities"),
      dining: media.filter((m) => m.category === "dining"),
      facilities: media.filter((m) => m.category === "facilities"),
    }
  }

  private generateTitle(category: string, type: string, index: number): string {
    const titles = {
      exterior: ["Hotel Exterior", "Grand Entrance", "Architectural View", "Night Facade"],
      rooms: ["Luxury Suite", "Standard Room", "Premium Bathroom", "City View Room"],
      amenities: ["Swimming Pool", "Fitness Center", "Spa & Wellness", "Business Lounge"],
      dining: ["Fine Dining Restaurant", "Cocktail Bar", "Room Service", "Breakfast Area"],
      facilities: ["Grand Lobby", "Conference Center", "Concierge Desk", "Reception Area"],
    }

    return titles[category as keyof typeof titles]?.[index] || `${category} ${type} ${index + 1}`
  }

  private generateDescription(hotelName: string, category: string, type: string): string {
    const descriptions = {
      exterior: `Stunning ${type} showcasing the architectural beauty of ${hotelName}`,
      rooms: `Elegant and comfortable accommodations at ${hotelName}`,
      amenities: `World-class facilities and amenities available at ${hotelName}`,
      dining: `Exceptional dining experiences offered at ${hotelName}`,
      facilities: `Premium facilities and services at ${hotelName}`,
    }

    return descriptions[category as keyof typeof descriptions] || `${category} ${type} from ${hotelName}`
  }

  private generatePrompt(hotelName: string, location: string, category: string, type: string): string {
    const prompts = {
      exterior: `Professional ${type} of ${hotelName} exterior in ${location}, architectural photography, golden hour lighting, luxury hotel facade`,
      rooms: `Interior ${type} of luxury hotel room at ${hotelName}, elegant furnishing, natural lighting, premium hospitality design`,
      amenities: `${type} of hotel amenities at ${hotelName}, modern facilities, professional hospitality photography, inviting atmosphere`,
      dining: `${type} of restaurant and dining areas at ${hotelName}, fine dining ambiance, professional food photography, elegant interior`,
      facilities: `${type} of hotel facilities at ${hotelName}, modern lobby and common areas, professional architectural photography`,
    }

    return prompts[category as keyof typeof prompts] || `${category} ${type} of ${hotelName}`
  }
}

export const aiMediaService = new AIMediaService()
