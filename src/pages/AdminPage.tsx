import { useNavigate } from "react-router-dom"
import DashboardLayout from "@/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const navigate = useNavigate()

  return (
    <DashboardLayout
      title="Administração"
      description="Área reservada para controle administrativo."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">42</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Comuns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">37</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => navigate("/dashboard/admin/novo")}>Novo Admin</Button>
        <Button variant="outline" onClick={() => navigate("/dashboard/admin/lista")}>
          Ver todos os Admins
        </Button>
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>Voltar</Button>
      </div>

      <h3 className="text-lg font-semibold mb-2">Configurações Avançadas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Permissões</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Gerencie permissões por tipo de usuário (admin ou comum).
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Redefinir Senhas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Permita que usuários redefinam suas senhas com segurança.
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Logs e Auditoria</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Visualize histórico de ações realizadas por administradores.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
