// WinnerModal.tsx
interface WinnerProps {
  isOpen: boolean
  onClose: () => void
  endGameInfo: EndGameInfo
}

export default function Winner({ isOpen, onClose, endGameInfo }: WinnerProps) {
  if (!isOpen || !endGameInfo) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />

      <div className='relative z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-xl'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>Game Over</h3>

          <div className='mt-4'>
            <p className='text-lg font-semibold'>
              {endGameInfo.winner === 1
                ? 'Black'
                : endGameInfo.winner === 2
                ? 'White'
                : 'Draw'}
              {endGameInfo.winner !== 0 &&
                ` wins by ${endGameInfo.margin} points!`}
            </p>

            <div className='mt-6 grid grid-cols-2 gap-8 bg-gray-50 p-4 rounded-lg'>
              <div className='text-center'>
                <span className='block text-sm font-semibold text-gray-600'>
                  Black
                </span>
                <span className='block text-3xl font-bold text-gray-900 mt-1'>
                  {endGameInfo.blackScore}
                </span>
              </div>

              <div className='text-center'>
                <span className='block text-sm font-semibold text-gray-600'>
                  White
                </span>
                <span className='block text-3xl font-bold text-gray-900 mt-1'>
                  {endGameInfo.whiteScore}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className='mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
