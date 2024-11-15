'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGame } from '@/lib/services';

export default function Game() {
  const router = useRouter();
  const [boardSize, setBoardSize] = useState(19);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateGame(request: CreateGameRequest) {
    try {
      setIsLoading(true);
      const game = await createGame(request);
      console.log('GAME', game);
      router.push(`/game/${game.id}`);
    } catch (error) {
      console.error('Failed to create game:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-orange-300 to-amber-400'>
      <div className='text-center space-y-12 px-4 animate-fade-in'>
        <h1 className='text-7xl font-bold text-white tracking-tight drop-shadow-lg'>
          Choose a mode
        </h1>

        <div className='flex flex-col items-center space-y-4 '>
          <label
            htmlFor='board-size'
            className='text-white text-lg font-semibold'
          >
            Select Board Size
          </label>

          <div className='flex space-x-4 p-4 rounded-xl bg-amber-500 shadow-amber-500/50 border-amber-400/20'>
            <button
              onClick={() => setBoardSize(9)}
              className={`px-4 py-2 text-lg rounded-lg shadow-md ${
                boardSize === 9
                  ? 'bg-white text-gray-700'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              9 x 9
            </button>

            <button
              onClick={() => setBoardSize(13)}
              className={`px-4 py-2 text-lg rounded-lg shadow-md ${
                boardSize === 13
                  ? 'bg-white text-gray-700'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              13 x 13
            </button>

            <button
              onClick={() => setBoardSize(19)}
              className={`px-4 py-2 text-lg rounded-lg shadow-md ${
                boardSize === 19
                  ? 'bg-white text-gray-700'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              19 x 19
            </button>
          </div>
        </div>

        <div className='flex flex-col p-4 items-center'>
          <button
            disabled={isLoading}
            onClick={() => handleCreateGame({ size: boardSize, mode: 'local' })}
            className='w-full max-w-xs px-10 py-4 mb-4 text-xl font-semibold rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/50 hover:bg-amber-400 hover:scale-105 transition-all duration-300 border-2 border-amber-400/20'
          >
            Local
          </button>

          {/* <button
            disabled
            onClick={() =>
              handleCreateGame({ size: boardSize, mode: 'online' })
            }
            className='w-full max-w-xs px-10 py-4 mb-4 text-xl font-semibold rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/50 hover:bg-amber-400 hover:scale-105 transition-all duration-300 border-2 border-amber-400/20'
          >
            Online
          </button>

          <button
            disabled
            onClick={() => handleCreateGame({ size: boardSize, mode: 'ai' })}
            className='w-full max-w-xs px-10 py-4 mb-4 text-xl font-semibold rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/50 hover:bg-amber-400 hover:scale-105 transition-all duration-300 border-2 border-amber-400/20'
          >
            Computer
          </button> */}
        </div>
      </div>
    </main>
  );
}
