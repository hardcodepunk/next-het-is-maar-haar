import Image from "next/image"
import BookingModal from "@/components/BookingModal"
import WidgetBar from "@/components/WidgetBar"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Centered content */}
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Image src="/logo.png" alt="Het is maar haar" width={300} height={300} priority />
        <BookingModal />
      </div>

      {/* Bottom widget */}
      <WidgetBar
        instagramUrl="https://instagram.com/REPLACE_ME"
        mapsUrl="https://www.google.com/maps?q=REPLACE_ME"
        phone="+32 REPLACE_ME"
      />
    </main>
  )
}
