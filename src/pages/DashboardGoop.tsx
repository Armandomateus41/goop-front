import { useEffect, useState } from "react"
import { Pedido, getPedidos } from "@/features/pedidos/api"
import Sidebar from "@/layout/Sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function DashboardGoop() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPedidos()
        setPedidos(data.pedidos || data) // depende do backend
      } catch (err) {
        console.error("Erro ao buscar pedidos", err)
      }
    }
    fetch()
  }, [])

  const totalPedidos = pedidos.length
  const totalFaturado = pedidos.reduce((acc, p) => acc + p.total, 0)
  const pendentes = pedidos.filter(p => p.status === "PENDENTE").length
  const ultimoPedido = pedidos[0]?.cliente || "-"

  return (
    <div className="flex min-h-screen bg-goop-bg">
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className="flex-1 px-6 py-10 space-y-6" style={{ marginLeft: isCollapsed ? 72 : 256 }}>
        <h2 className="text-2xl font-title font-semibold text-goop">Painel de Controle</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalPedidos}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Faturado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-goop">
                R$ {totalFaturado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-700">{pendentes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Último Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{ultimoPedido}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
