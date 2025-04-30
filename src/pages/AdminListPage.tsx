import html2pdf from "html2pdf.js"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
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
import { Pencil, Trash2, ShieldCheck, Eye, Settings2, Download } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

interface Admin {
  _id: string
  nome: string
  email: string
  role: string
  permissions?: string[]
  createdAt: string
}

const permissoesDetalhes: Record<string, { label: string; description: string; icon: JSX.Element; className: string }> = {
  gerenciar_admins: {
    label: "Gerenciar Admins",
    description: "Permite cadastrar, editar e excluir administradores.",
    icon: <Settings2 size={14} />, className: "bg-red-100 text-red-700"
  },
  editar_pedidos: {
    label: "Editar Pedidos",
    description: "Pode modificar pedidos existentes.",
    icon: <Pencil size={14} />, className: "bg-yellow-100 text-yellow-800"
  },
  visualizar_dashboard: {
    label: "Ver Dashboard",
    description: "Pode acessar dados do painel principal.",
    icon: <Eye size={14} />, className: "bg-blue-100 text-blue-700"
  },
  exportar_pdf: {
    label: "Exportar PDF",
    description: "Pode exportar visualizações como PDF.",
    icon: <ShieldCheck size={14} />, className: "bg-green-100 text-green-700"
  }
}

const coresAleatorias = ["bg-white", "bg-gray-50", "bg-slate-50", "bg-zinc-50"]

export default function AdminListPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [busca, setBusca] = useState("")
  const [filtroPermissao, setFiltroPermissao] = useState("")
  const [pagina, setPagina] = useState(1)
  const [ordenarAsc, setOrdenarAsc] = useState(true)
  const refPdf = useRef<HTMLDivElement>(null)

  const { toast } = useToast()
  const navigate = useNavigate()

  const porPagina = 6

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const lista = response.data.filter((u: Admin) => u.role === "admin")
      setAdmins(lista)
    } catch (err) {
      toast({ title: "Erro ao buscar administradores", description: "Tente novamente.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este administrador?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast({ title: "Administrador excluído", description: "Removido com sucesso." })
      fetchAdmins()
    } catch {
      toast({ title: "Erro ao excluir", description: "Falha ao remover.", variant: "destructive" })
    }
  }

  useEffect(() => { fetchAdmins() }, [])

  const adminsFiltrados = admins
    .filter((admin) =>
      admin.nome.toLowerCase().includes(busca.toLowerCase()) ||
      admin.email.toLowerCase().includes(busca.toLowerCase())
    )
    .filter((admin) =>
      filtroPermissao ? admin.permissions?.includes(filtroPermissao) : true
    )
    .sort((a, b) => ordenarAsc
      ? a.nome.localeCompare(b.nome)
      : b.nome.localeCompare(a.nome))

  const adminsPaginados = adminsFiltrados.slice((pagina - 1) * porPagina, pagina * porPagina)

  const totalPaginas = Math.ceil(adminsFiltrados.length / porPagina)
  const totalPermissoes = admins.reduce((acc, a) => acc + (a.permissions?.length || 0), 0)

  const exportarPDF = () => {
    if (!refPdf.current) return
    html2pdf().set({
      margin: 10,
      filename: `admins.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(refPdf.current).save()
  }

  return (
    <DashboardLayout title="Lista de Administradores" description="Gerencie os administradores cadastrados.">
      <TooltipProvider>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Total de administradores: <strong>{admins.length}</strong></p>
            <p>Total de permissões atribuídas: <strong>{totalPermissoes}</strong></p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm"
            />
            <select
              className="border px-3 py-2 rounded-md text-sm"
              value={filtroPermissao}
              onChange={(e) => setFiltroPermissao(e.target.value)}
            >
              <option value="">Todas permissões</option>
              {Object.keys(permissoesDetalhes).map((key) => (
                <option key={key} value={key}>{permissoesDetalhes[key].label}</option>
              ))}
            </select>
            <Button variant="secondary" onClick={() => setOrdenarAsc(!ordenarAsc)}>
              {ordenarAsc ? "A-Z" : "Z-A"}
            </Button>
            <Button onClick={exportarPDF} variant="outline">
              <Download size={16} className="mr-2" /> Exportar PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" ref={refPdf}>
          {adminsPaginados.length === 0 ? (
            <p className="text-muted-foreground">Nenhum administrador encontrado.</p>
          ) : (
            adminsPaginados.map((admin, i) => {
              const corFundo = coresAleatorias[i % coresAleatorias.length]
              return (
                <Card key={admin._id} className={`${corFundo}`}>
                  <CardHeader>
                    <CardTitle className="text-base">{admin.nome}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{admin.email}</p>
                    <p className="text-muted-foreground">
                      Criado em: {format(new Date(admin.createdAt), "dd 'de' MMMM yyyy", { locale: ptBR })}
                    </p>
                    <Badge variant="outline" className="text-green-600 border-green-500 mt-1">
                      {admin.role}
                    </Badge>

                    {admin.permissions?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {admin.permissions.map((p, i) => {
                          const perm = permissoesDetalhes[p] || {
                            label: p,
                            description: "Permissão personalizada",
                            icon: <Settings2 size={14} />,
                            className: "bg-gray-100 text-gray-700"
                          }
                          return (
                            <Tooltip key={i}>
                              <TooltipTrigger asChild>
                                <Badge className={`text-xs flex items-center gap-1 ${perm.className}`}>
                                  {perm.icon} {perm.label}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">{perm.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/admin/editar/${admin._id}`)}>
                        <Pencil size={16} className="mr-1" /> Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/admin/permissoes/${admin._id}`)}>
                        <ShieldCheck size={16} className="mr-1" /> Permissões
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(admin._id)}>
                        <Trash2 size={16} className="mr-1" /> Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <Button size="sm" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}>
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {pagina} de {totalPaginas}
            </span>
            <Button size="sm" onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>
              Próxima
            </Button>
          </div>
        )}
      </TooltipProvider>
    </DashboardLayout>
  )
}
