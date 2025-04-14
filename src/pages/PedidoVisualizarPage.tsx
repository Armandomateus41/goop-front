import html2pdf from "html2pdf.js"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { getPedidoById } from "@/features/pedidos/api"
import Sidebar from "@/layout/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PedidoVisualizarPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [pedido, setPedido] = useState<any>(null)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPedidoById(id!)
        setPedido(data)
      } catch (err) {
        console.error("Erro ao buscar pedido", err)
      }
    }
    fetch()
  }, [id])

  const handleExportPDF = () => {
    if (!pdfRef.current) return
    html2pdf()
      .set({
        margin: 10,
        filename: `pedido-${pedido._id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(pdfRef.current)
      .save()
  }

  const renderStatusBadge = (status: string) => {
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

  if (!pedido) return <div className="p-10">Carregando pedido...</div>

  return (
    <div className="flex min-h-screen bg-goop-bg">
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className="flex-1 px-6 py-10 space-y-6" style={{ marginLeft: isCollapsed ? 72 : 256 }}>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-goop">Visualizar Pedido</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>Exportar PDF</Button>
            <Button variant="ghost" onClick={() => navigate("/dashboard/pedidos")}>
              Voltar
            </Button>
          </div>
        </div>

        <Card ref={pdfRef} className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Pedido #{pedido._id}</h3>
            {renderStatusBadge(pedido.status)}
          </div>
          <p><strong>Cliente:</strong> {pedido.cliente}</p>
          <p><strong>Total:</strong> R$ {Number(pedido.total).toFixed(2)}</p>
          <p><strong>Criado em:</strong> {new Date(pedido.criadoEm).toLocaleString()}</p>

          <div>
            <strong>Itens:</strong>
            <ul className="mt-2 list-disc list-inside text-sm">
              {pedido.itens.map((item: any, index: number) => (
                <li key={index}>
                  {item.quantidade}x {item.nome} — R$ {Number(item.preco).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </main>
    </div>
  )
}
