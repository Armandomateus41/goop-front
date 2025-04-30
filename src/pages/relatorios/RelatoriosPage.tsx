import DashboardLayout from "@/layout/DashboardLayout"
import Header from "@/layout/Header"
import Sidebar from "@/layout/Sidebar"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import axios from "axios"
import { Button } from "@/components/ui/button"
import html2pdf from "html2pdf.js"
import { saveAs } from "file-saver"
import { unparse } from "papaparse"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Pedido {
  _id: string
  cliente: string
  total: number
  status: string
  criadoEm: string
}

interface Usuario {
  _id: string
  nome: string
  email: string
  role: string
  createdAt: string
}

export default function RelatoriosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [faturamento, setFaturamento] = useState(0)
  const [dataInicial, setDataInicial] = useState("")
  const [dataFinal, setDataFinal] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  const fetchDados = async () => {
    const token = localStorage.getItem("token")
    const pedidosResp = await axios.get("http://localhost:3000/api/pedidos", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const usuariosResp = await axios.get("http://localhost:3000/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    })

    setPedidos(pedidosResp.data.pedidos || [])
    setUsuarios(usuariosResp.data || [])
    const total = pedidosResp.data.pedidos?.reduce((acc: number, p: Pedido) => acc + (p.total || 0), 0) || 0
    setFaturamento(total)
  }

  useEffect(() => {
    fetchDados()
  }, [])

  const pedidosFiltrados = pedidos.filter((p) => {
    const criado = new Date(p.criadoEm).getTime()
    const de = dataInicial ? new Date(dataInicial).getTime() : 0
    const ate = dataFinal ? new Date(dataFinal).getTime() : Infinity
    const statusMatch = statusFiltro ? p.status === statusFiltro : true
    return criado >= de && criado <= ate && statusMatch
  })

  const exportarPDF = () => {
    if (!pdfRef.current) return
    html2pdf().set({
      margin: 10,
      filename: "relatorio-pedidos.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(pdfRef.current).save()
  }

  const exportarCSV = () => {
    const dados = pedidosFiltrados.map((p) => ({
      cliente: p.cliente,
      status: p.status,
      total: p.total,
      criadoEm: format(new Date(p.criadoEm), "yyyy-MM-dd"),
    }))
    const csv = unparse(dados)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, "relatorio-pedidos.csv")
  }

  const exportarGrafico = () => {
    if (!chartRef.current) return
    const svg = chartRef.current.querySelector("svg")
    if (!svg) return
    const svgBlob = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" })
    saveAs(svgBlob, "grafico-pedidos.svg")
  }

  const totalAdmins = usuarios.filter((u) => u.role === "admin").length
  const totalComuns = usuarios.filter((u) => u.role !== "admin").length

  const graficoStatus = [
    { name: "Pendentes", value: pedidosFiltrados.filter(p => p.status === "PENDENTE").length },
    { name: "Processados", value: pedidosFiltrados.filter(p => p.status === "PROCESSADO").length },
  ]
  const COLORS = ["#facc15", "#22c55e"]

  return (
    <div className="flex min-h-screen bg-goop-bg">
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className="flex-1 px-6 py-10 space-y-6" style={{ marginLeft: isCollapsed ? 72 : 256 }}>
        <Header />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-goop">Relatórios</h2>
          <Button variant="ghost" onClick={() => window.history.back()} className="text-goop hover:underline">
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50 border border-blue-200 shadow-sm">
            <CardHeader><CardTitle className="text-blue-700">Total de Pedidos</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-blue-800">{pedidos.length}</CardContent>
          </Card>
          <Card className="bg-green-50 border border-green-200 shadow-sm">
            <CardHeader><CardTitle className="text-green-700">Total Faturado</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-green-700">R$ {faturamento.toFixed(2)}</CardContent>
          </Card>
          <Card className="bg-purple-50 border border-purple-200 shadow-sm">
            <CardHeader><CardTitle className="text-purple-700">Administradores</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-purple-700">{totalAdmins}</CardContent>
          </Card>
          <Card className="bg-gray-50 border border-gray-200 shadow-sm">
            <CardHeader><CardTitle className="text-gray-700">Usuários Comuns</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold text-gray-700">{totalComuns}</CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Data Inicial</label>
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Data Final</label>
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Status</label>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="PROCESSADO">Processado</option>
            </select>
          </div>
          <Button onClick={exportarPDF}>Exportar PDF</Button>
          <Button onClick={exportarCSV}>Exportar CSV</Button>
          <Button onClick={exportarGrafico}>Exportar Gráfico</Button>
        </div>

        <div ref={chartRef} className="bg-white border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2 text-goop">Gráfico de Faturamento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pedidosFiltrados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cliente" />
              <YAxis />
              <RechartTooltip />
              <Bar dataKey="total" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2 text-goop">Pedidos por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={graficoStatus} dataKey="value" nameKey="name" outerRadius={100} label>
                {graficoStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div ref={pdfRef} className="space-y-4">
          {pedidosFiltrados.map((p) => (
            <Card key={p._id} className="bg-white border border-gray-200">
              <CardContent className="py-3 text-sm space-y-1">
                <p><strong>Cliente:</strong> {p.cliente}</p>
                <p><strong>Status:</strong> {p.status}</p>
                <p><strong>Total:</strong> R$ {p.total.toFixed(2)}</p>
                <p><strong>Criado em:</strong> {format(new Date(p.criadoEm), "dd/MM/yyyy")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
