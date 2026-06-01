"use client"

import { useTheme } from "@/lib/hooks/use-theme"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      position="top-right"
      richColors
      
      expand={false}
      visibleToasts={4}
      offset={16}
      gap={10}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-500" />,
        info: <InfoIcon className="size-4 text-sky-500" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error: <OctagonXIcon className="size-4 text-red-500" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      style={
        {
          "--normal-bg": "color-mix(in oklab, var(--popover) 92%, transparent)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "color-mix(in oklab, var(--border) 70%, transparent)",
          "--border-radius": "14px",
        } as React.CSSProperties
      }
      toastOptions={{
        duration: 2600,
        classNames: {
          toast:
            "cn-toast backdrop-blur-md shadow-lg border px-4 py-3 text-sm",
          title: "font-semibold tracking-tight",
          description: "text-muted-foreground text-xs leading-relaxed",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-xs font-medium",
          cancelButton:
            "bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg px-3 py-1.5 text-xs font-medium",
          closeButton:
            "bg-background/80 border-border hover:bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
