import { createContext, type PropsWithChildren } from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage.ts'

// eslint-disable-next-line react-refresh/only-export-components
export const SettingsContext = createContext<
  | {
      reduceMotion: boolean
      setReduceMotion: (value: boolean) => void
    }
  | undefined
>(undefined)

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [reduceMotion, setReduceMotion] = useLocalStorage<boolean>(
    'reduce-motion',
    false
  )

  return (
    <SettingsContext value={{ reduceMotion, setReduceMotion }}>
      {children}
    </SettingsContext>
  )
}
