import { useNavigate } from "react-router-dom"
import { PedidoForm } from "@/features/pedidos/PedidoForm"
import Sidebar from "@/layout/Sidebar"
import { useState } from "react"

export default function PedidoNovoPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-goop-bg">
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className="flex-1 px-6 py-10 space-y-6" style={{ marginLeft: isCollapsed ? 72 : 256 }}>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-goop">Novo Pedido</h2>
          <button
            onClick={() => navigate("/dashboard/pedidos")}
            className="text-sm text-goop hover:underline"
          >
            Voltar para lista
          </button>
        </div>

        <PedidoForm />
      </main>
    </div>
  )
}
