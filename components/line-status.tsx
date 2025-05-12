import { AlertCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

interface LineStatusProps {
  line: string
  color: string
  status: "normal" | "delayed" | "disrupted"
  stations: string
  message?: string
}

export function LineStatus({ line, color, status, stations, message }: LineStatusProps) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center p-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-sm"
          style={{ backgroundColor: color }}
        >
          {line}
        </div>
        <div className="ml-3 flex-1">
          <div className="text-xs font-medium">{stations}</div>
          <div className="flex items-center mt-1">
            {status === "normal" && (
              <>
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="ml-1 text-xs text-green-500">Service normal</span>
              </>
            )}
            {status === "delayed" && (
              <>
                <Clock className="h-3 w-3 text-amber-500" />
                <span className="ml-1 text-xs text-amber-500">Retards signalés</span>
              </>
            )}
            {status === "disrupted" && (
              <>
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span className="ml-1 text-xs text-red-500">Service perturbé</span>
              </>
            )}
          </div>
        </div>
        {message && (
          <Badge variant={status === "disrupted" ? "destructive" : "outline"} className="ml-auto text-xs">
            Info
          </Badge>
        )}
      </div>

      {message && (
        <Accordion type="single" collapsible className="border-t">
          <AccordionItem value="details">
            <AccordionTrigger className="px-3 py-2 text-xs">Voir détails</AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1">
              <div
                className={cn(
                  "rounded-md p-2 text-xs",
                  status === "disrupted" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800",
                )}
              >
                <div className="flex">
                  <AlertCircle className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{message}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
