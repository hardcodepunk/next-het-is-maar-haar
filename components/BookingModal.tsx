"use client"

import { useEffect, useState } from "react"

export default function BookingModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 rounded-full bg-[#b188d3] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.03] active:scale-[0.98]"
      >
        Afspraak maken
      </button>

      <div className={["fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none"].join(" ")}>
        <div
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 bg-black/30 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            className={[
              "w-full max-w-md rounded-3xl transition-all duration-200",
              "max-sm:h-[92vh] max-sm:max-w-none",
              "bg-[#b188d3]",
              open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2",
            ].join(" ")}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <div className="text-sm font-semibold text-white">Afspraak maken</div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/30"
              >
                Sluiten
              </button>
            </div>

            <div className="px-6 pb-6 text-sm text-white/80">Binnenkort: boekingsflow.</div>
          </div>
        </div>
      </div>
    </>
  )
}
