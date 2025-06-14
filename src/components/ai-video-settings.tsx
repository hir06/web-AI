import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface AIVideoSettings {
  autoGenerate: boolean
  videoQuality: "standard" | "high" | "ultra"
  videoDuration: number
  videoStyle: "cinematic" | "realistic" | "artistic"
  autoPlay: boolean
  showControls: boolean
}

interface AIVideoSettingsProps {
  settings: AIVideoSettings
  onSettingsChange: (settings: AIVideoSettings) => void
}

export function AIVideoSettingsComponent({ settings, onSettingsChange }: AIVideoSettingsProps) {
  const [localSettings, setLocalSettings] = useState<AIVideoSettings>(settings)

  const updateSetting = <K extends keyof AIVideoSettings>(key: K, value: AIVideoSettings[K]) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onSettingsChange(newSettings)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>AI Video Settings</span>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto Generate */}
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-generate" className="text-sm font-medium">
            Auto-generate videos
          </Label>
          <Switch
            id="auto-generate"
            checked={localSettings.autoGenerate}
            onCheckedChange={(checked) => updateSetting("autoGenerate", checked)}
          />
        </div>

        {/* Video Quality */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Video Quality</Label>
          <Select
            value={localSettings.videoQuality}
            onValueChange={(value) => updateSetting("videoQuality", value as AIVideoSettings["videoQuality"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (720p)</SelectItem>
              <SelectItem value="high">High (1080p)</SelectItem>
              <SelectItem value="ultra">Ultra (4K)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video Duration */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Video Duration: {localSettings.videoDuration}s</Label>
          <Slider
            value={[localSettings.videoDuration]}
            onValueChange={(values) => updateSetting("videoDuration", values[0])}
            max={30}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        {/* Video Style */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Video Style</Label>
          <Select
            value={localSettings.videoStyle}
            onValueChange={(value) => updateSetting("videoStyle", value as AIVideoSettings["videoStyle"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cinematic">Cinematic</SelectItem>
              <SelectItem value="realistic">Realistic</SelectItem>
              <SelectItem value="artistic">Artistic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Play */}
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-play" className="text-sm font-medium">
            Auto-play videos
          </Label>
          <Switch
            id="auto-play"
            checked={localSettings.autoPlay}
            onCheckedChange={(checked) => updateSetting("autoPlay", checked)}
          />
        </div>

        {/* Show Controls */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-controls" className="text-sm font-medium">
            Show video controls
          </Label>
          <Switch
            id="show-controls"
            checked={localSettings.showControls}
            onCheckedChange={(checked) => updateSetting("showControls", checked)}
          />
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            💡 Videos are generated using AI based on hotel descriptions and locations. Higher quality settings may take
            longer to generate.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
