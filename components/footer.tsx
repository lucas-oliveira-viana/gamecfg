import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <Link href="/cookie-settings" className="text-sm text-gray-400 hover:text-white">
            Cookie settings
          </Link>
          <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
            Contact
          </Link>
          <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

