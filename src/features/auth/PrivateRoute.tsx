import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/auth.context"

interface Props {
  children: React.ReactNode
}

export function PrivateRoute({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) return <p>Carregando autenticação...</p>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
