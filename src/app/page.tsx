import Link from 'next/link';
import WalletButton from '@/components/WalletButton';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">🚀 Saros DLMM Demo</h1>
      <p className="text-gray-600 mb-6">Build the future of DeFi with Saros SDKs</p>

      <div className="flex gap-4">
        <WalletButton />
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
