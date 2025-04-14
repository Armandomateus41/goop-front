import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Sidebar from "@/layout/Sidebar"
import { PedidoForm } from "@/features/pedidos/PedidoForm"
import axios from "axios"

export default function PedidoEditarPage() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`http://localhost:3000/api/pedidos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setPedido(response.data)
      } catch (err) {
        console.error("Erro ao carregar pedido", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPedido()
  }, [id])

  if (loading) return <div className="p-10">Carregando pedido...</div>
  if (!pedido) return <div className="p-10 text-red-500">Pedido não encontrado.</div>

  return (
    <div className="flex min-h-screen bg-goop-bg">
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className="flex-1 px-6 py-10 space-y-6" style={{ marginLeft: isCollapsed ? 72 : 256 }}>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-goop">Editar Pedido</h2>
          <button
            onClick={() => navigate("/dashboard/pedidos")}
            className="text-sm text-goop hover:underline"
          >
            Voltar para lista
          </button>
        </div>

        <PedidoForm pedido={pedido} modo="editar" />
      </main>
    </div>
  )
}
