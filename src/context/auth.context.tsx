import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchUserFromToken } from "@/features/auth/authService"

interface AuthContextType {
  user: { name: string; email: string } | null
  logout: () => void
  loading: boolean
  setUserFromToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
  loading: true,
  setUserFromToken: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  const setUserFromToken = async () => {
    try {
      const user = await fetchUserFromToken()
      setUser(user)
    } catch {
      logout()
    }
  }

  useEffect(() => {
    setUserFromToken().finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, logout, loading, setUserFromToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
