import Sidebar from "@/layout/Sidebar"
import { PedidosList } from "@/features/pedidos/PedidosList"
import { useState } from "react"

export default function PedidosPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-goop-bg">
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main
        className="flex-1 px-6 py-10 space-y-6"
        style={{ marginLeft: isCollapsed ? 72 : 256 }}
      >
        <h2 className="text-3xl font-bold text-goop mb-6">Pedidos</h2>
        <PedidosList />
      </main>
    </div>
  )
}
