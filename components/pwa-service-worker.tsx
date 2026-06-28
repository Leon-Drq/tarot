"use client"

import { useEffect } from "react"

export function PwaServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (!("serviceWorker" in navigator)) return
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return

    let cancelled = false

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" })
        if (cancelled) return
        registration.update().catch(() => undefined)
      } catch {
        // Installation is an optional return-path enhancement; never block the app.
      }
    }

    if (document.readyState === "complete") {
      register()
      return () => {
        cancelled = true
      }
    }

    window.addEventListener("load", register, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener("load", register)
    }
  }, [])

  return null
}
