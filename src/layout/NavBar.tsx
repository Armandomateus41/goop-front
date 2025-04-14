import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/context/auth.context"
import { Button } from "@/components/ui/button"

export default function NavBar() {
  const { logout, user } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-bold">Goop Distribuidora</h1>
        <Link to="/dashboard" className={isActive("/dashboard") ? "underline" : ""}>
          Painel
        </Link>
        <Link to="/dashboard/pedidos" className={isActive("/dashboard/pedidos") ? "underline" : ""}>
          Pedidos
        </Link>
        <Link to="/dashboard/admin" className={isActive("/dashboard/admin") ? "underline" : ""}>
          Administração
        </Link>
        <Link to="/dashboard/relatorios" className={isActive("/dashboard/relatorios") ? "underline" : ""}>
          Relatórios
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && <span className="text-sm">Olá, {user.name}</span>}
        <Button variant="secondary" size="sm" onClick={logout}>
          Sair
        </Button>
      </div>
    </nav>
  )
}
