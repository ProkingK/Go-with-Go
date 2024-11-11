'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-orange-300 to-amber-400'>
      <div className='text-center space-y-12 px-4 animate-fade-in'>
        <h1 className='text-7xl font-bold text-white tracking-tight drop-shadow-lg'>
          Go with Go
        </h1>

        <p className='text-2xl text-white max-w-2xl mx-auto'>
          Experience the ancient game of strategy and territory{' '}
          <strong>Go!</strong> built with Go(lang).
        </p>

        <button
          onClick={() => router.push('/game')}
          className='px-10 py-4 text-xl font-semibold rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/50 hover:bg-amber-400 hover:scale-105 transition-all duration-300 border-2 border-amber-400/20'
        >
          Play Now
        </button>
      </div>
    </main>
  );
}
