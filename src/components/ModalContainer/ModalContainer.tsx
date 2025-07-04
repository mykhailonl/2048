import { AnimatePresence, motion } from 'framer-motion'

import { useModal } from '../../hooks/useModal.ts'
import { Overlays } from '../../overlays/Overlays.tsx'
import { Modal } from '../Modal'

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const ModalContainer = () => {
  const { modalType, closeModal } = useModal()

  const renderModal = () => {
    switch (modalType) {
      case 'win':
        return <Modal type="win" />
      case 'lose':
        return <Modal type="lose" />
      case 'confirmNewGame':
        return <Modal type="confirmNewGame" />
      default:
        return null
    }
  }

  return (
    <Overlays>
      <AnimatePresence>
        {modalType && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              transition={{ duration: 0.2 }}
              onClick={closeModal}
            />

            <motion.div
              className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-game border-4 border-board rounded-2xl shadow-2xl p-8 text-center">
                {renderModal()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Overlays>
  )
}
