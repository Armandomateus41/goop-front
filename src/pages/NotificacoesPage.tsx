import { useEffect, useState } from "react"
import DashboardLayout from "@/layout/DashboardLayout"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface Notificacao {
  _id: string
  titulo: string
  mensagem: string
  tipo: "info" | "success" | "warning" | "error"
  createdAt: string
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

  const fetchNotificacoes = async () => {
    const token = localStorage.getItem("token")
    const response = await axios.get("http://localhost:3000/api/notificacoes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setNotificacoes(response.data)
  }

  useEffect(() => {
    fetchNotificacoes()
  }, [])

  return (
    <DashboardLayout
      title="Notificações"
      description="Visualize todas as mensagens do sistema."
    >
      <div className="space-y-4">
        {notificacoes.map((n) => (
          <Card key={n._id} className="border-l-4" style={{
            borderColor:
              n.tipo === "success" ? "#22c55e" :
              n.tipo === "warning" ? "#eab308" :
              n.tipo === "error"   ? "#ef4444" :
              "#3b82f6"
          }}>
            <CardHeader>
              <CardTitle>{n.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{n.mensagem}</p>
              <p className="text-xs mt-2">
                {format(new Date(n.createdAt), "dd/MM/yyyy HH:mm")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}