import React, { useState } from 'react'

interface Data {
  id: string
  name: string
  title: string
  url: string
}

interface DeleteModalContextProps {
  data: Data
  isOpen: boolean
  initializeDeleteModal: (payload: Data) => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface ProviderProps {
  children: React.ReactNode
}

export const DeleteModalContext = React.createContext<DeleteModalContextProps | undefined>(undefined)

export const DeleteModalProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [data, setData] = useState<Data>({
    id: '',
    name: '',
    title: '',
    url: ''
  })

  const initializeDeleteModal = (payload: Data) => {
    setData(payload)
    setIsOpen(true)
  }

  return <DeleteModalContext.Provider value={{ data, isOpen, initializeDeleteModal, setIsOpen }}>{children}</DeleteModalContext.Provider>
}

import { useContext } from 'react'

export const useDeleteModal = () => {
  const context = useContext(DeleteModalContext)
  if (context === undefined) {
    throw new Error('use delete modal should be ')
  }
  return context
}
