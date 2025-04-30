import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth.context"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex justify-between items-center border-b border-gray-200 px-4 py-2 bg-white">
      <h1 className="text-lg font-semibold text-goop">Goop Distribuidora</h1>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="/user.png" />
            <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            {user?.name || "Administrador"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            Painel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
