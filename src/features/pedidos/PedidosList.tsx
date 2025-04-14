import { useEffect, useState } from "react"
import { getPedidosComPaginacao, deletePedido, Pedido } from "./api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Eye, Pencil } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
      console.error("Erro ao buscar pedidos:", error)
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
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeClass}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Pedidos</h2>
        <Link to="/dashboard/pedidos/novo">
          <Button className="text-sm">Novo Pedido</Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por cliente"
          value={cliente}
          onChange={(e) => {
            setCliente(e.target.value)
            setPage(1)
          }}
          className="border px-3 py-1 rounded text-sm"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="TODOS">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="PROCESSADO">Processado</option>
        </select>

        {/* ✅ Botão limpar filtros */}
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
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Estado: carregando */}
      {isLoading ? (
        <p className="text-muted-foreground mt-4">Carregando pedidos...</p>

      ) : pedidos.length === 0 ? (
        // Estado: sem resultados
        <p className="text-muted-foreground mt-4">
          Nenhum pedido encontrado.
        </p>
      ) : (
        <>
          {/* ✅ Total de resultados */}
          <p className="text-sm text-muted-foreground">
            Exibindo {pedidos.length} pedido{pedidos.length > 1 && "s"}
          </p>

          {pedidos.map((pedido) => (
            <Card key={pedido._id} className="p-4 space-y-1 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-goop">{pedido.cliente}</p>
                  <p className="text-sm text-muted-foreground">
                    Total: R$ {Number(pedido.total).toFixed(2)} —{" "}
                    {renderStatusBadge(pedido.status)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/dashboard/pedidos/${pedido._id}`)}
                    className="flex items-center gap-1"
                  >
                    <Pencil size={16} />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/dashboard/pedidos/visualizar/${pedido._id}`)}
                    className="flex items-center gap-1"
                  >
                    <Eye size={16} />
                    <span className="hidden sm:inline">Visualizar</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(pedido._id)}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Excluir</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </>
      )}

      {/* Paginação */}
      <div className="flex justify-center gap-3 mt-4">
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
