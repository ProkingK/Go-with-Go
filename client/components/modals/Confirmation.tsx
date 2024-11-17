interface ConfirmationProps {
  title: string
  isOpen: boolean
  description: string
  cancelText?: string
  confirmText?: string
  onClose: () => void
  onConfirm: () => void
}

export default function Confirmation({
  title,
  isOpen,
  onClose,
  onConfirm,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm'
}: ConfirmationProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />

      <div className='relative z-50 w-full max-w-md bg-white rounded-lg p-6 shadow-xl'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          <p className='mt-2 text-sm text-gray-600'>{description}</p>
        </div>

        <div className='mt-6 flex justify-end space-x-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
          >
            {cancelText}
          </button>

          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
