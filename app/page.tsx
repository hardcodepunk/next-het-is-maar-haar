import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Image src="/logo.png" alt="Het is maar haar" width={320} height={320} priority />
    </main>
  )
}
