'use client';

import { useState, useEffect } from 'react';
import Board from '@/components/Board';

export default function Game() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>(
    'black'
  );
  const [size, setSize] = useState<number>(19);

  const fetchBoard = async () => {
    try {
      const response = await fetch('http://localhost:8080/board');
      const data = await response.json();
      const { Size, Turn, Grid } = data;

      setGrid(Grid);
      setSize(Size);
      setCurrentPlayer(Turn === 1 ? 'black' : 'white');
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handleIntersectionClick = async (x: number, y: number) => {
    if (grid[y][x] !== 0) return;

    try {
      const response = await fetch('http://localhost:8080/move', {
        method: 'POST',
        body: JSON.stringify({ x, y }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      await fetchBoard();
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

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

      <h2 className='text-3xl font-semibold mb-6 text-gray-800 shadow-md backdrop-blur-sm bg-white/60 p-3 rounded-lg z-10'>
        Current Turn: <span className='capitalize'>{currentPlayer}</span>
      </h2>

      <div className='bg-amber-100 p-4 rounded-3xl shadow-2xl ring-4 ring-yellow-300 ring-opacity-50 z-10'>
        <Board
          size={size}
          grid={grid}
          onIntersectionClick={handleIntersectionClick}
        />
      </div>
    </div>
  );
}
