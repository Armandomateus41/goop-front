import { Link, useNavigate } from "react-router-dom"
import DashboardLayout from "@/layout/DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const navigate = useNavigate()

  
  const totalUsuarios = 42
  const totalAdmins = 5
  const totalUsuariosComuns = totalUsuarios - totalAdmins

  return (
    <DashboardLayout
      title="Administração"
      description="Área reservada para controle administrativo."
    >
      {/* Cards com estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsuarios}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{totalAdmins}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Comuns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalUsuariosComuns}</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações administrativas */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link to="/dashboard/admin/novo">
          <Button variant="default">Novo Admin</Button>
        </Link>
        <Link to="/dashboard/admin/lista">
          <Button variant="outline">Ver todos os Admins</Button>
        </Link>
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          Voltar
        </Button>
      </div>

      
      <div className="p-6 border rounded-lg shadow-sm bg-white text-muted-foreground">
        Em breve: gerenciamento de usuários, permissões e configurações avançadas.
      </div>
    </DashboardLayout>
  )
}
