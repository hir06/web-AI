export interface VideoGenerationRequest {
  prompt: string
  duration?: number
  style?: "cinematic" | "realistic" | "artistic"
  aspectRatio?: "16:9" | "9:16" | "1:1"
}

export interface GeneratedVideo {
  id: string
  url: string
  thumbnailUrl: string
  prompt: string
  status: "generating" | "completed" | "failed"
  duration: number
}

// Mock video URLs (replace with actual generated videos)
const mockVideoUrls = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
]

class AIVideoService {
  private cache = new Map<string, GeneratedVideo>()

  async generateHotelVideo(hotelName: string, location: string, description: string): Promise<GeneratedVideo> {
    const cacheKey = `${hotelName}-${location}`

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    // Create prompt for AI video generation
    const prompt = this.createVideoPrompt(hotelName, location, description)

    // Simulate AI video generation
    const video = await this.mockGenerateVideo(prompt, cacheKey)

    // Cache the result
    this.cache.set(cacheKey, video)

    return video
  }

  private createVideoPrompt(hotelName: string, location: string, description: string): string {
    // Create detailed prompts for AI video generation
    const prompts = [
      `Cinematic establishing shot of ${hotelName} in ${location}, luxury hotel exterior with elegant architecture, golden hour lighting, smooth camera movement`,
      `Interior walkthrough of ${hotelName}, elegant lobby with marble floors, crystal chandeliers, guests walking through, warm ambient lighting`,
      `Hotel room showcase at ${hotelName}, modern luxury suite with city views, soft natural lighting, camera slowly panning across the room`,
      `Rooftop view from ${hotelName} overlooking ${location}, panoramic cityscape, sunset colors, gentle breeze effect`,
      `Spa and wellness area at ${hotelName}, serene pool area, soft lighting, water reflections, peaceful atmosphere`,
    ]

    return prompts[Math.floor(Math.random() * prompts.length)]
  }

  private async mockGenerateVideo(prompt: string, id: string): Promise<GeneratedVideo> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Randomly select a mock video URL
    const videoUrl = mockVideoUrls[Math.floor(Math.random() * mockVideoUrls.length)]

    return {
      id,
      url: videoUrl,
      thumbnailUrl: `/placeholder.svg?height=250&width=400&text=${encodeURIComponent("Video Thumbnail")}`,
      prompt,
      status: "completed",
      duration: 15,
    }
  }

  // Method to integrate with real AI video services
  async generateVideoWithRealAPI(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    // Example integration with RunwayML Gen-2
    /*
    const response = await fetch('https://api.runwayml.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAYML_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        duration: request.duration || 4,
        aspect_ratio: request.aspectRatio || '16:9',
        style: request.style || 'cinematic',
      }),
    })
    
    const result = await response.json()
    return {
      id: result.id,
      url: result.video_url,
      thumbnailUrl: result.thumbnail_url,
      prompt: request.prompt,
      status: result.status,
      duration: result.duration,
    }
    */

    // For now, return mock data
    return this.mockGenerateVideo(request.prompt, Date.now().toString())
  }
}

export const aiVideoService = new AIVideoService()
