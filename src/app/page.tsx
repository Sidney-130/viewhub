import Link from 'next/link'
import WalletButton from '@/components/dashboard/WalletButton'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Viewhub</h1>
      <p className="text-gray-600 mb-6">Analytics, position tracker and management all in one place.</p>

      <div className="flex gap-4">
        <WalletButton />
        <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Get Started
        </Link>
      </div>
    </main>
  )
}
