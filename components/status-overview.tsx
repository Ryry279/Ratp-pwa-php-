"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatusOverviewProps {
  metroTotal: number
  metroNormal: number
  rerTotal: number
  rerNormal: number
}

export function StatusOverview({ metroTotal = 0, metroNormal = 0, rerTotal = 0, rerNormal = 0 }: StatusOverviewProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }
      setCurrentTime(now.toLocaleDateString("fr-FR", options))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Métro</CardTitle>
          {metroNormal === metroTotal ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">
            {metroNormal}/{metroTotal}
          </div>
          <p className="text-xs text-muted-foreground">Lignes normales</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mise à jour</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xs font-medium">{currentTime || "Chargement..."}</div>
          <p className="text-xs text-muted-foreground">Actualisé automatiquement</p>
        </CardContent>
      </Card>
    </div>
  )
}
