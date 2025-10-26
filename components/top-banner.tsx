"use client"

export function TopBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-foreground">Basketball Packs Now Live</span>
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-foreground">Open Today</span>
      </div>
    </div>
  )
}
