import { useEffect, useState } from "react"
import DashboardLayout from "@/layout/DashboardLayout"
import axios from "axios"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Admin {
  _id: string
  nome: string
  email: string
  role: string
  createdAt: string
}

export default function AdminListPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const { toast } = useToast()
  const navigate = useNavigate()

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const lista = response.data.filter((u: Admin) => u.role === "admin")
      setAdmins(lista)
    } catch (err) {
      toast({
        title: "Erro ao buscar administradores",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    const confirmar = confirm("Deseja realmente excluir este administrador?")
    if (!confirmar) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast({
        title: "Administrador excluído",
        description: "O administrador foi removido com sucesso.",
      })

      fetchAdmins()
    } catch (err) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover o administrador.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  return (
    <DashboardLayout
      title="Lista de Administradores"
      description="Visualize e gerencie os administradores cadastrados."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.length === 0 ? (
          <p className="text-muted-foreground">Nenhum administrador encontrado.</p>
        ) : (
          admins.map((admin) => (
            <Card key={admin._id} className="relative group">
              <CardHeader>
                <CardTitle className="text-base">{admin.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="text-muted-foreground">{admin.email}</p>
                <p className="text-muted-foreground">
                  Criado em: {format(new Date(admin.createdAt), "dd 'de' MMMM yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <Badge variant="outline" className="text-green-600 border-green-500 mt-2">
                  {admin.role}
                </Badge>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/dashboard/admin/editar/${admin._id}`)}
                  >
                    <Pencil size={16} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(admin._id)}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}