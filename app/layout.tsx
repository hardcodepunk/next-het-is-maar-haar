import "./globals.css"
import FluidBackground from "@/components/FluidBackground"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <FluidBackground />
        {children}
      </body>
    </html>
  )
}
