"use client"

import { useState, useEffect } from "react"
import { LineStatus } from "@/components/line-status"
import { StatusOverview } from "@/components/status-overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstallPrompt } from "@/components/install-prompt"
import { Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Type pour les données de l'API
interface ApiData {
  metro?: {
    totalLines?: number
    normalLines?: number
    lines?: Array<{
      line: string
      status: "normal" | "delayed" | "disrupted"
      stations?: string
      message?: string
    }>
  }
  rer?: {
    totalLines?: number
    normalLines?: number
    lines?: Array<{
      line: string
      status: "normal" | "delayed" | "disrupted"
      stations?: string
      message?: string
    }>
  }
}

// Couleurs des lignes
const metroColors: Record<string, string> = {
  "1": "#FFCD00",
  "2": "#0064B0",
  "3": "#9D9D9C",
  "4": "#C04191",
  "5": "#F28E42",
  "6": "#6ECA97",
  "7": "#FA9ABA",
  "8": "#E3B32A",
  "9": "#B6BD00",
  "10": "#DCA714",
  "11": "#704B1C",
  "12": "#007E49",
  "13": "#6EC4E8",
  "14": "#62259D",
}

const rerColors: Record<string, string> = {
  A: "#E3051C",
  B: "#4B92DB",
  C: "#FFCC30",
  D: "#00A962",
  E: "#A0006E",
}

export default function Home() {
  const [isOnline, setIsOnline] = useState(true)
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Vérifier si en ligne
  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Charger les données
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ratp", {
        // Ajouter un cache-buster pour éviter les problèmes de cache
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      // Vérifier si la réponse est du JSON valide
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La réponse n'est pas au format JSON")
      }

      let apiData = await response.json()

      // Normaliser les données pour s'assurer qu'elles ont la structure attendue
      apiData = normalizeData(apiData)

      setData(apiData)
      setError(null)
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err)
      setError("Impossible de charger les données. Veuillez réessayer.")

      // En cas d'erreur, utiliser des données de secours
      setData(getFallbackData())
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour normaliser les données et s'assurer qu'elles ont la structure attendue
  const normalizeData = (data: any): ApiData => {
    // Si les données sont complètement différentes de ce qu'on attend,
    // on crée une structure compatible
    const normalized: ApiData = {
      metro: {
        totalLines: 0,
        normalLines: 0,
        lines: [],
      },
      rer: {
        totalLines: 0,
        normalLines: 0,
        lines: [],
      },
    }

    // Si data.metro existe, on l'utilise, sinon on essaie de trouver des données pertinentes
    if (data.metro) {
      normalized.metro = {
        totalLines: data.metro.totalLines || data.metro.lines?.length || 0,
        normalLines: data.metro.normalLines || 0,
        lines: Array.isArray(data.metro.lines) ? data.metro.lines : [],
      }
    } else if (data.lines) {
      // Si l'API retourne directement un tableau de lignes
      const metroLines = Array.isArray(data.lines) ? data.lines.filter((line: any) => !line.line?.includes("RER")) : []

      normalized.metro = {
        totalLines: metroLines.length,
        normalLines: metroLines.filter((l: any) => l.status === "normal").length,
        lines: metroLines,
      }
    }

    // Même chose pour RER
    if (data.rer) {
      normalized.rer = {
        totalLines: data.rer.totalLines || data.rer.lines?.length || 0,
        normalLines: data.rer.normalLines || 0,
        lines: Array.isArray(data.rer.lines) ? data.rer.lines : [],
      }
    } else if (data.lines) {
      // Si l'API retourne directement un tableau de lignes
      const rerLines = Array.isArray(data.lines) ? data.lines.filter((line: any) => line.line?.includes("RER")) : []

      normalized.rer = {
        totalLines: rerLines.length,
        normalLines: rerLines.filter((l: any) => l.status === "normal").length,
        lines: rerLines,
      }
    }

    return normalized
  }

  // Données de secours en cas d'erreur
  const getFallbackData = (): ApiData => {
    return {
      metro: {
        totalLines: 16,
        normalLines: 14,
        lines: [
          { line: "1", status: "normal", stations: "La Défense - Château de Vincennes" },
          { line: "2", status: "normal", stations: "Porte Dauphine - Nation" },
          { line: "3", status: "normal", stations: "Pont de Levallois - Gallieni" },
          { line: "4", status: "normal", stations: "Porte de Clignancourt - Mairie de Montrouge" },
          { line: "5", status: "normal", stations: "Bobigny - Place d'Italie" },
          { line: "6", status: "normal", stations: "Charles de Gaulle-Étoile - Nation" },
          { line: "7", status: "normal", stations: "La Courneuve - Mairie d'Ivry/Villejuif" },
          { line: "8", status: "normal", stations: "Balard - Pointe du Lac" },
          { line: "9", status: "normal", stations: "Pont de Sèvres - Mairie de Montreuil" },
          { line: "10", status: "normal", stations: "Boulogne - Gare d'Austerlitz" },
          { line: "11", status: "normal", stations: "Châtelet - Mairie des Lilas" },
          { line: "12", status: "normal", stations: "Front Populaire - Mairie d'Issy" },
          {
            line: "13",
            status: "delayed",
            stations: "Asnières-Gennevilliers/Saint-Denis - Châtillon-Montrouge",
            message: "Ralentissements en raison d'une affluence exceptionnelle.",
          },
          { line: "14", status: "normal", stations: "Saint-Lazare - Olympiades" },
        ],
      },
      rer: {
        totalLines: 5,
        normalLines: 4,
        lines: [
          {
            line: "A",
            status: "delayed",
            stations: "Saint-Germain-en-Laye - Marne-la-Vallée",
            message: "Retards de 15 minutes.",
          },
          { line: "B", status: "normal", stations: "Robinson - Aéroport CDG" },
          { line: "C", status: "normal", stations: "Pontoise - Massy" },
          { line: "D", status: "normal", stations: "Orry-la-Ville - Melun" },
          { line: "E", status: "normal", stations: "Haussmann Saint-Lazare - Chelles" },
        ],
      },
    }
  }

  useEffect(() => {
    fetchData()

    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Extraire les valeurs avec des valeurs par défaut sécurisées
  const metroTotal = data?.metro?.totalLines || 0
  const metroNormal = data?.metro?.normalLines || 0
  const rerTotal = data?.rer?.totalLines || 0
  const rerNormal = data?.rer?.normalLines || 0
  const metroLines = data?.metro?.lines || []
  const rerLines = data?.rer?.lines || []

  return (
    <main className="container mx-auto p-4 max-w-md">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">RATP Status</h1>
        <p className="text-sm text-muted-foreground">Informations en temps réel</p>
      </div>

      {!isOnline && (
        <div className="mb-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
          Vous êtes hors ligne. Certaines données peuvent ne pas être à jour.
        </div>
      )}

      <InstallPrompt />

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-800 rounded-md space-y-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
            <p>{error}</p>
          </div>
          <Button onClick={fetchData} variant="outline" size="sm">
            Réessayer
          </Button>
        </div>
      ) : (
        <>
          <StatusOverview metroTotal={metroTotal} metroNormal={metroNormal} rerTotal={rerTotal} rerNormal={rerNormal} />

          <div className="mt-6">
            <Tabs defaultValue="metro">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="metro">Métro</TabsTrigger>
                <TabsTrigger value="rer">RER</TabsTrigger>
              </TabsList>

              <TabsContent value="metro" className="mt-4 space-y-3">
                {metroLines.length > 0 ? (
                  metroLines.map((line) => (
                    <LineStatus
                      key={line.line}
                      line={line.line}
                      color={metroColors[line.line] || "#666666"}
                      status={line.status}
                      stations={line.stations || ""}
                      message={line.message}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Aucune information disponible pour les lignes de métro.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rer" className="mt-4 space-y-3">
                {rerLines.length > 0 ? (
                  rerLines.map((line) => (
                    <LineStatus
                      key={line.line}
                      line={line.line}
                      color={rerColors[line.line] || "#666666"}
                      status={line.status}
                      stations={line.stations || ""}
                      message={line.message}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Aucune information disponible pour les lignes de RER.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </main>
  )
}
