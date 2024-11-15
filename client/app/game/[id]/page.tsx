'use client';

import { useEffect, useState } from 'react';

import Board from '@/components/Board';
import { useParams } from 'next/navigation';
import { getGame, makeMove } from '@/lib/services';

export default function GamePage() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        const data = await getGame(id as string);

        setGame(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch game');
      }
    }

    fetchGame();
  }, [id]);

  async function handleMove(x: number, y: number) {
    if (!game || isLoading) return;

    console.log(error);

    try {
      setIsLoading(true);
      const updatedGame = await makeMove(game.id, { x, y });
      setGame(updatedGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make move');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-300 p-8 overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-40 animate-pulse-gradient'></div>
      <div className='absolute inset-0 pointer-events-none'>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className='absolute w-16 h-16 bg-white bg-opacity-20 rounded-full blur-lg animate-float'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {game ? (
        <>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-bold mb-2'>Game #{game.id}</h1>

            <div className='mt-2 text-sm'>
              Score - Black: {game.score.black} | White: {game.score.white}
            </div>
          </div>

          <h2 className='text-3xl font-semibold mb-6 text-gray-800 shadow-md backdrop-blur-sm bg-white/60 p-3 rounded-lg z-10'>
            Current Turn: <span className='capitalize'>{game.turn}</span>
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
