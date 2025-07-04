export type ModalType = 'win' | 'lose' | 'confirmNewGame' | null

export interface ModalContextType {
  modalType: ModalType
  openModal: (type: Exclude<ModalType, null>) => void
  closeModal: () => void
}

export type ModalProps = {
  type: ModalType
}
