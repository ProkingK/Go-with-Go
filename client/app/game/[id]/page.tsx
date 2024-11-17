'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import Board from '@/components/Board'
import WinnerModal from '@/components/modals/Winner'
import ConfirmationModal from '@/components/modals/Confirmation'
import { getGame, makeMove, passMove, resignGame } from '@/lib/services'

export default function GamePage() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [game, setGame] = useState<Game | null>(null)
  const [showPassDialog, setShowPassDialog] = useState(false)
  const [showResignDialog, setShowResignDialog] = useState(false)
  const [showEndGameDialog, setShowEndGameDialog] = useState(false)
  const [endGameInfo, setEndGameInfo] = useState<EndGameInfo | null>(null)

  useEffect(() => {
    async function fetchGame() {
      try {
        const data = await getGame(id as string)

        setGame(data)
        checkGameEnd(data)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to fetch game')
      }
    }

    fetchGame()
  }, [id])

  function checkGameEnd(game: Game) {
    if (!game.isOver) return

    const winner =
      game.score.black === game.score.white
        ? 0
        : game.score.black > game.score.white
        ? 1
        : 2

    const margin = Math.abs(game.score.black - game.score.white)

    setEndGameInfo({
      winner,
      margin,
      blackScore: game.score.black,
      whiteScore: game.score.white
    })

    setShowEndGameDialog(true)
  }

  async function handleMove(x: number, y: number) {
    if (!game || isLoading) return
    try {
      setIsLoading(true)

      const updatedGame = await makeMove(game.id, { x, y })

      setGame(updatedGame)
      checkGameEnd(updatedGame)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to make move')
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePass() {
    if (!game || isLoading) return

    try {
      setIsLoading(true)

      const updatedGame = await passMove(game.id)

      setGame(updatedGame)
      checkGameEnd(updatedGame)

      toast.success('Pass move successful')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to pass')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResign() {
    if (!game || isLoading) return
    try {
      setIsLoading(true)

      const updatedGame = await resignGame(game.id)

      setGame(updatedGame)
      checkGameEnd(updatedGame)

      toast.success('Game resigned')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to resign')
    } finally {
      setIsLoading(false)
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

          <div className='mt-6 space-x-4 z-10'>
            <button
              onClick={() => setShowPassDialog(true)}
              disabled={isLoading || game.isOver}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Pass
            </button>

            <button
              onClick={() => setShowResignDialog(true)}
              disabled={isLoading || game.isOver}
              className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Resign
            </button>
          </div>

          <ConfirmationModal
            isOpen={showPassDialog}
            onClose={() => setShowPassDialog(false)}
            onConfirm={handlePass}
            confirmText='Pass'
            title='Confirm Pass'
            description='Are you sure you want to pass your turn? If both players pass consecutively, the game will end.'
          />

          <ConfirmationModal
            isOpen={showResignDialog}
            onClose={() => setShowResignDialog(false)}
            onConfirm={handleResign}
            confirmText='Resign'
            title='Confirm Resignation'
            description='Are you sure you want to resign? This will end the game and count as a loss.'
          />

          <WinnerModal
            isOpen={showEndGameDialog}
            endGameInfo={endGameInfo!}
            onClose={() => setShowEndGameDialog(false)}
          />
        </>
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  )
}
