import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import DashboardLayout from "@/layout/DashboardLayout"
import axios from "axios"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const permissoesDisponiveis = [
  "gerenciar_admins",
  "editar_pedidos",
  "visualizar_dashboard",
  "exportar_pdf",
]

export default function PermissaoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<string[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchUsuario = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const u = response.data.find((u: any) => u._id === id)
      setUsuario(u)
      setPermissoesSelecionadas(u.permissions || [])
    } catch (err) {
      toast({
        title: "Erro ao carregar usuário",
        description: "Verifique a conexão.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchUsuario()
  }, [id])

  const handleToggle = (permissao: string) => {
    setPermissoesSelecionadas((prev) =>
      prev.includes(permissao)
        ? prev.filter((p) => p !== permissao)
        : [...prev, permissao]
    )
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      await axios.patch(
        `http://localhost:3000/api/usuarios/${id}/permissoes`,
        { permissions: permissoesSelecionadas },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast({
        title: "Permissões atualizadas",
        description: "As permissões foram salvas com sucesso.",
      })

      navigate("/dashboard/admin/lista")
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar as permissões.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout
      title="Gerenciar Permissões"
      description={`Usuário: ${usuario?.nome || "Carregando..."}`}
    >
      <div className="space-y-4 max-w-xl">
        {permissoesDisponiveis.map((p) => (
          <div key={p} className="flex items-center gap-3">
            <Checkbox
              checked={permissoesSelecionadas.includes(p)}
              onCheckedChange={() => handleToggle(p)}
              id={`perm-${p}`}
            />
            <label htmlFor={`perm-${p}`} className="text-sm text-muted-foreground capitalize">
              {p.replace(/_/g, " ")}
            </label>
          </div>
        ))}

        <Button onClick={handleSubmit} disabled={loading} className="mt-4">
          {loading ? "Salvando..." : "Salvar permissões"}
        </Button>
      </div>
    </DashboardLayout>
  )
}
