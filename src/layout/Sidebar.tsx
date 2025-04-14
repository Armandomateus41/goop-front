import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/context/auth.context"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  PackageSearch,
  ShieldCheck,
  BarChart,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

const links = [
  { to: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { to: "/dashboard/pedidos", label: "Pedidos", icon: PackageSearch },
  { to: "/dashboard/admin", label: "Administração", icon: ShieldCheck },
  { to: "/dashboard/relatorios", label: "Relatórios", icon: BarChart },
]

interface SidebarProps {
  onCollapseChange?: (collapsed: boolean) => void
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
  const { logout, user } = useAuth()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    if (onCollapseChange) onCollapseChange(newState)
  }

  useEffect(() => {
    if (onCollapseChange) onCollapseChange(isCollapsed)
  }, [onCollapseChange, isCollapsed])

  return (
    <aside
      className={`bg-goop-dark text-white h-screen p-4 shadow-md flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="space-y-6 font-title">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h1 className="text-lg font-bold tracking-wide text-white">Goop</h1>
          )}
          <button onClick={toggleCollapse} className="text-white">
            {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        {!isCollapsed && user && (
          <p className="text-sm font-light text-white/80">Olá, {user.name}</p>
        )}

        <nav className="flex flex-col gap-2 font-sans">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-white text-goop font-bold shadow"
                    : "hover:bg-goop hover:text-white text-white/80"
                }`}
                title={isCollapsed ? label : undefined}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="flex items-center gap-2 w-full justify-center text-white hover:bg-goop hover:text-white"
      >
        <LogOut size={16} />
        {!isCollapsed && <span>Sair</span>}
      </Button>
    </aside>
  )
}
