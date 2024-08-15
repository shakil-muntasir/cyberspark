import React, { createContext, useContext, ReactNode } from 'react'
import { User } from '@/Pages/User/type'

interface UserContextProps {
  user: User | null
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
  authUser: User | null
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, authUser }) => {
  return <UserContext.Provider value={{ user: authUser }}>{children}</UserContext.Provider>
}

export const useUser = (): User | null => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context.user
}
