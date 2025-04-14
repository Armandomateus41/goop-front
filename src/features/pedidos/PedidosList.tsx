import { useEffect, useState } from "react"
import { getPedidosComPaginacao, deletePedido, Pedido } from "./api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Eye, Pencil } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export function PedidosList() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cliente, setCliente] = useState("")
  const [status, setStatus] = useState("TODOS")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchPedidos = async () => {
    try {
      setIsLoading(true)
      const { pedidos, pages } = await getPedidosComPaginacao(page, cliente, status)
      setPedidos(pedidos || [])
      setTotalPages(pages || 1)
    } catch (error) {
      toast({
        title: "Erro ao buscar pedidos",
        description: "Verifique sua conexão ou tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPedidos()
  }, [page, cliente, status])

  const handleDelete = async (id: string) => {
    const confirmar = confirm("Deseja realmente excluir este pedido?")
    if (!confirmar) return

    try {
      await deletePedido(id)
      fetchPedidos()
      toast({
        title: "Pedido excluído",
        description: "O pedido foi removido com sucesso.",
      })
    } catch (err) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o pedido.",
        variant: "destructive",
      })
    }
  }

  const renderStatusBadge = (status: Pedido["status"]) => {
    const badgeClass =
      status === "PROCESSADO"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-800"

    return (
      <span className={cn(
        "text-xs px-2 py-1 rounded-full font-medium",
        badgeClass
      )}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-title font-semibold text-goop">Pedidos</h2>
        <Link to="/dashboard/pedidos/novo">
          <Button variant="default" className="text-sm">Novo Pedido</Button>
        </Link>
      </div>

      {/* Filtros agrupados */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar por cliente"
            value={cliente}
            onChange={(e) => {
              setCliente(e.target.value)
              setPage(1)
            }}
            className="border px-3 py-2 rounded-md text-sm w-[200px] focus:outline-none focus:ring-1 focus:ring-goop"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="border px-3 py-2 rounded-md text-sm text-muted-foreground"
          >
            <option value="TODOS">Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="PROCESSADO">Processado</option>
          </select>
          {(cliente || status !== "TODOS") && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setCliente("")
                setStatus("TODOS")
                setPage(1)
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-2 md:mt-0">
          Exibindo {pedidos.length} resultado{pedidos.length !== 1 && "s"}
        </p>
      </Card>

      {/* Resultados */}
      {isLoading ? (
        <p className="text-muted-foreground">Carregando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="text-muted-foreground mt-4">Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          {pedidos.map((pedido) => (
            <Card key={pedido._id} className="p-4 rounded-xl shadow-sm border border-muted bg-white">
              <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-goop">{pedido.cliente}</p>
                  <p className="text-sm text-muted-foreground">
                    Total: R$ {Number(pedido.total).toFixed(2)} — {renderStatusBadge(pedido.status)}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/dashboard/pedidos/${pedido._id}`)}
                  >
                    <Pencil size={16} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/dashboard/pedidos/visualizar/${pedido._id}`)}
                  >
                    <Eye size={16} className="mr-1" />
                    Visualizar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(pedido._id)}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-center gap-3 mt-6">
        <Button size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          ← Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <Button size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Próxima →
        </Button>
      </div>
    </div>
  )
}
