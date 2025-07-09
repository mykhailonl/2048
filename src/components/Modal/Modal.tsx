import { useGameActions } from '../../hooks/useGameActions.ts'
import { useModal } from '../../hooks/useModal.ts'
import type { ModalProps } from '../../types/ModalTypes.ts'

export const Modal = ({ type }: ModalProps) => {
  const { newGame } = useGameActions()
  const { closeModal } = useModal()

  const handlePrimaryAction = () => {
    if (type === 'confirmNewGame') {
      newGame()
      closeModal()
    } else {
      newGame()
      closeModal()
    }
  }

  const getContent = () => {
    switch (type) {
      case 'win':
        return {
          title: '🎉 You Win!',
          subtitle: 'Congratulations! You reached 2048!',
          buttonText: 'New Game',
          secondaryButtonText: 'Continue',
          buttonColor: 'bg-green-500 hover:bg-green-600',
          ariaLabel: 'Start new game',
          showSecondButton: true,
        }
      case 'lose':
        return {
          title: 'Game Over',
          subtitle: 'No more moves available. Try again?',
          buttonText: 'Try Again',
          secondaryButtonText: 'Continue',
          buttonColor: 'bg-orange-500 hover:bg-orange-600',
          ariaLabel: 'Start new game',
          showSecondButton: true,
        }
      case 'confirmNewGame':
        return {
          title: 'Start New Game?',
          subtitle:
            'Your current progress will be lost. Are you sure you want to continue?',
          buttonText: 'Start New Game',
          secondaryButtonText: 'Cancel',
          buttonColor: 'bg-red-500 hover:bg-red-600',
          ariaLabel: 'Start new game',
          showSecondButton: true,
        }
      default:
        return {
          title: '',
          subtitle: '',
          buttonText: '',
          secondaryButtonText: '',
          buttonColor: '',
          ariaLabel: '',
          showSecondButton: false,
        }
    }
  }

  const content = getContent()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-gray-800">{content.title}</h2>

        <p className="text-lg text-gray-600 leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handlePrimaryAction}
          className={`px-6 py-3 ${content.buttonColor} text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg`}
          aria-label={content.ariaLabel}
        >
          {content.buttonText}
        </button>

        {content.showSecondButton && (
          <button
            onClick={closeModal}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            aria-label={`${content.secondaryButtonText} button`}
          >
            {content.secondaryButtonText}
          </button>
        )}
      </div>
    </div>
  )
}
