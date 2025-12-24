"use client"

type Props = {
  instagramUrl?: string
  phone?: string
  mapsUrl?: string
}

export default function WidgetBar({
  instagramUrl = "https://instagram.com/",
  phone = "+32 ",
  mapsUrl = "https://www.google.com/maps",
}: Props) {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#b188d3] px-5 py-2 text-xs font-semibold text-white transition hover:scale-[1.03] active:scale-[0.98]"
        >
          Instagram
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#b188d3] px-5 py-2 text-xs font-semibold text-white transition hover:scale-[1.03] active:scale-[0.98]"
        >
          Locatie
        </a>

        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="rounded-full bg-[#b188d3] px-5 py-2 text-xs font-semibold text-white transition hover:scale-[1.03] active:scale-[0.98]"
        >
          Contact
        </a>
      </div>
    </div>
  )
}
