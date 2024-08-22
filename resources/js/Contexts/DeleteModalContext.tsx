import React, { useState } from 'react'

export interface DeleteModalData {
  id: string
  name: string
  title: string
  onConfirm: () => void
}

interface DeleteModalContextProps {
  data: DeleteModalData
  isOpen: boolean
  initializeDeleteModal: (payload: DeleteModalData) => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface ProviderProps {
  children: React.ReactNode
}

export const DeleteModalContext = React.createContext<DeleteModalContextProps | undefined>(undefined)

export const DeleteModalProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [data, setData] = useState<DeleteModalData>({
    id: '',
    name: '',
    title: '',
    onConfirm: () => null
  })

  const initializeDeleteModal = (payload: DeleteModalData) => {
    setData(payload)
    setIsOpen(true)
  }

  return <DeleteModalContext.Provider value={{ data, isOpen, initializeDeleteModal, setIsOpen }}>{children}</DeleteModalContext.Provider>
}

import { useContext } from 'react'

export const useDeleteModal = () => {
  const context = useContext(DeleteModalContext)
  if (context === undefined) {
    throw new Error('useDeleteModal must be used within a DeleteModalProvider')
  }
  return context
}
