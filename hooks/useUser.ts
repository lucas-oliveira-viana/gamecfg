import { useState, useEffect } from 'react'
import { verifyToken } from '@/utils/jwt'

type User = {
  id: number
  steamid: string
  username: string
  avatar?: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = verifyToken(token)
      if (decoded && decoded.payload) {
        setUser(decoded.payload)
      } else {
        localStorage.removeItem('token')
      }
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem('token', token)
    const decoded = verifyToken(token)
    if (decoded && decoded.payload) {
      setUser(decoded.payload)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return { user, login, logout }
}

