import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Footer } from '@/components/footer'
import { ConfigUploaderHome } from '@/components/config-uploader-home'
import FlickeringGrid from "@/components/ui/flickering-grid"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <FlickeringGrid className="absolute inset-0 z-0" color="#6B7280" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <Hero />
        <main className="container mx-auto px-4 pt-8 pb-16">
          <div id="config-upload-section">
            <ConfigUploaderHome />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

