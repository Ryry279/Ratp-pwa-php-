"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if already installed
    const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(isInStandaloneMode)

    // Only show prompt on iOS and not already installed
    setShowPrompt(isIOSDevice && !isInStandaloneMode)
  }, [])

  if (!showPrompt) {
    return null
  }

  return (
    <div className="mb-6 rounded-lg border bg-muted/40 p-3">
      <div className="flex items-start">
        <Download className="h-5 w-5 mr-2 mt-0.5 text-primary" />
        <div>
          <h3 className="text-sm font-medium">Installer l'application</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Pour installer cette app sur votre iPhone, appuyez sur
            <span className="mx-1">
              <svg
                className="inline-block h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 12h8M12 8v8M3 12h1M12 3v1M21 12h-1M12 21v-1M18.4 18.4l-.7-.7M18.4 5.6l-.7.7M5.6 5.6l.7.7M5.6 18.4l.7-.7" />
              </svg>
            </span>
            puis "Sur l'écran d'accueil"
          </p>
        </div>
      </div>
    </div>
  )
}
