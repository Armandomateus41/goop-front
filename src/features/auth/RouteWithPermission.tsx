import { useAuth } from "@/context/auth.context"
import { Navigate } from "react-router-dom"

interface Props {
  children: React.ReactNode
  permission: string
}

export function RouteWithPermission({ children, permission }: Props) {
  const { user } = useAuth()

  if (!user?.permissions?.includes(permission)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
