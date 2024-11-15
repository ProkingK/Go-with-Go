'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Board from '@/components/Board';
import { useParams } from 'next/navigation';
import { getGame, makeMove } from '@/lib/services';

export default function GamePage() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        const data = await getGame(id as string);
        setGame(data);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to fetch game'
        );
      }
    }

    fetchGame();
  }, [id]);

  async function handleMove(x: number, y: number) {
    if (!game || isLoading) return;

    try {
      setIsLoading(true);
      const updatedGame = await makeMove(game.id, { x, y });
      setGame(updatedGame);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to make move');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='relative min-h-screen flex flex-col items-center bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-300 p-8 overflow-hidden'>
      <Toaster position='top-center' toastOptions={{ duration: 1000 }} />
      <div className='absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-40 animate-pulse-gradient'></div>

      {game ? (
        <>
          <div className='text-center mb-4 z-10'>
            <h1 className='text-4xl font-bold mb-2 text-gray-800 tracking-wide'>
              Game: {game.id}
            </h1>

            <div className='mt-4 text-lg font-semibold bg-white/70 backdrop-blur-sm px-6 py-2 rounded-full shadow-md inline-block'>
              <span className='mr-3'>Black: {game.score.black}</span>
              <span className='text-gray-400'>|</span>
              <span className='ml-3'>White: {game.score.white}</span>
            </div>
          </div>

          <h2 className='text-3xl font-semibold mb-6 text-gray-800 shadow-md backdrop-blur-sm bg-white/60 p-3 rounded-lg z-10'>
            Current Turn:{' '}
            <span className='capitalize'>
              {game.turn == 1 ? 'Black' : 'White'}
            </span>
          </h2>

          <div className='bg-amber-100 p-4 rounded-3xl shadow-2xl ring-4 ring-yellow-300 ring-opacity-50 z-10'>
            <Board
              size={game.board.size}
              grid={game.board.grid}
              onIntersectionClick={handleMove}
            />
          </div>
        </>
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
}
