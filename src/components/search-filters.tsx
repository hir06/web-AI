"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import type { SearchFilters } from "../types/hotel"

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClearFilters: () => void
}

const amenitiesList = [
  "Free WiFi",
  "Pool",
  "Spa",
  "Restaurant",
  "Gym",
  "Bar",
  "Concierge",
  "Room Service",
  "Business Center",
  "Parking",
]

export function SearchFiltersComponent({ filters, onFiltersChange, onClearFilters }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 1000])

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities || []
    const newAmenities = checked ? [...currentAmenities, amenity] : currentAmenities.filter((a) => a !== amenity)

    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    })
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort By */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Sort by</Label>
          <Select
            value={filters.sortBy || "popularity"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                sortBy: value as "price" | "rating" | "distance" | "popularity",
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Price per night: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Minimum rating</Label>
          <Select
            value={filters.rating?.toString() || "any"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                rating: value === "any" ? undefined : Number.parseFloat(value),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any rating</SelectItem>
              <SelectItem value="4.5">4.5+ Excellent</SelectItem>
              <SelectItem value="4.0">4.0+ Very good</SelectItem>
              <SelectItem value="3.5">3.5+ Good</SelectItem>
              <SelectItem value="3.0">3.0+ Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amenities */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Amenities</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {amenitiesList.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities?.includes(amenity) || false}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <Label htmlFor={amenity} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
