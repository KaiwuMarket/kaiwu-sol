"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const rarityOptions = ["Common", "Uncommon", "Rare", "Holo Rare", "Ultra Rare"]
const gradeOptions = ["PSA 10", "PSA 9", "PSA 8", "PSA 7", "BGS 10"]
const setOptions = ["Scarlet & Violet", "Sword & Shield", "Sun & Moon", "XY", "Black & White"]

export function MarketplaceFilters({ isVisible, onToggle }: { isVisible: boolean; onToggle: () => void }) {
  const [priceRange, setPriceRange] = useState([0, 560])

  return (
    <aside
      className={cn(
        "fixed right-0 top-10 bottom-0 bg-background border-l border-border overflow-y-auto transition-all duration-300 z-40",
        isVisible ? "w-80" : "w-0",
      )}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            {isVisible ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <Button variant="outline" size="sm" className="w-full bg-transparent">
          Clear All
        </Button>

        <div>
          <h4 className="text-sm font-medium mb-3">Price Range (SOL)</h4>
          <Slider value={priceRange} onValueChange={setPriceRange} max={560} step={10} className="mb-2" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]} SOL</span>
            <span>{priceRange[1]} SOL</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Rarity</h4>
          <div className="space-y-2">
            {rarityOptions.map((rarity) => (
              <div key={rarity} className="flex items-center gap-2">
                <Checkbox id={`rarity-${rarity}`} />
                <Label htmlFor={`rarity-${rarity}`} className="text-sm cursor-pointer">
                  {rarity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Grade</h4>
          <div className="space-y-2">
            {gradeOptions.map((grade) => (
              <div key={grade} className="flex items-center gap-2">
                <Checkbox id={`grade-${grade}`} />
                <Label htmlFor={`grade-${grade}`} className="text-sm cursor-pointer">
                  {grade}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Card Set</h4>
          <div className="space-y-2">
            {setOptions.map((set) => (
              <div key={set} className="flex items-center gap-2">
                <Checkbox id={`set-${set}`} />
                <Label htmlFor={`set-${set}`} className="text-sm cursor-pointer">
                  {set}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
