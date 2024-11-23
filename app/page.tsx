import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Footer } from '@/components/footer'
import { ConfigUploaderHome } from '@/components/config-uploader-home'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-16">
        <div id="config-upload-section">
          <ConfigUploaderHome />
        </div>
      </main>
      <Footer />
    </div>
  )
}

