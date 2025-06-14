import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "./ui/input"
import { Card } from "./ui/card"
import { MapPin, Loader2 } from "lucide-react"
import { searchDestinations } from "../data/mockData"

interface Destination {
  id: string
  name: string
  country: string
  fullName: string
}

interface DestinationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function DestinationAutocomplete({ value, onChange, placeholder, className }: DestinationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Destination[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchDestinationsDebounced = async () => {
      if (value.length < 2) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setLoading(true)
      try {
        const results = await searchDestinations(value)
        setSuggestions(results)
        setIsOpen(results.length > 0)
        setHighlightedIndex(-1)
      } catch (error) {
        console.error("Failed to search destinations:", error)
        setSuggestions([])
        setIsOpen(false)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchDestinationsDebounced, 300)
    return () => clearTimeout(timeoutId)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSuggestionClick = (destination: Destination) => {
    onChange(destination.name)
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          onChange(suggestions[highlightedIndex].name)
          setIsOpen(false)
          setHighlightedIndex(-1)
          inputRef.current?.blur()
        }
        break
      case "Escape":
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          className={`pl-10 ${className}`}
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto shadow-lg">
          <div className="py-2">
            {suggestions.map((destination, index) => (
              <div
                key={destination.id}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === highlightedIndex ? "bg-purple-50 text-purple-700" : "hover:bg-gray-50"
                }`}
                onClick={() => handleSuggestionClick(destination)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">{destination.name}</div>
                    <div className="text-sm text-gray-500">{destination.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
