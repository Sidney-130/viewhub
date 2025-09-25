import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="h-screen p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4 text-emerald-400">Viewhub</h1>
        <Link
          href="/dashboard"
          className="font-semibold px-4 py-2 bg-emerald-600 text-white rounded-sm hover:bg-emerald-700"
        >
          Get Started
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <p className="text-white mb-6 text-4xl leading-12">
          Analytics, position tracker <br /> and management all in one place.
        </p>
        <div className="flex">
          <Link
            href="/dashboard"
            className="font-semibold px-4 py-2 bg-emerald-600 text-white rounded-sm hover:bg-emerald-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  )
}
