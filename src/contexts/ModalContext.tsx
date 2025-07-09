import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react'

import type { ModalContextType, ModalType } from '../types/ModalTypes.ts'

// eslint-disable-next-line react-refresh/only-export-components
export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
)

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modalType, setModalType] = useState<ModalType>(null)

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const openModal = useCallback((type: ModalType) => {
    setModalType(type)

    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setModalType(null)

    document.body.style.overflow = ''
  }, [])

  const value = {
    modalType,
    openModal,
    closeModal,
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}
