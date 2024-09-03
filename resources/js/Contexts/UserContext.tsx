import React, { createContext, useContext, ReactNode } from 'react'
import { UserResource } from '@/Pages/User/types'

interface UserContextProps {
  user: UserResource | null
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
  authUser: UserResource | null
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, authUser }) => {
  return <UserContext.Provider value={{ user: authUser }}>{children}</UserContext.Provider>
}

export const useUser = (): UserResource | null => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context.user
}
