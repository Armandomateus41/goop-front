import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import DashboardLayout from "@/layout/DashboardLayout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["admin", "user"]),
})

type FormData = z.infer<typeof schema>

export default function AdminEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      role: "admin",
    },
  })

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`http://localhost:3000/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const usuario = response.data.find((u: any) => u._id === id)
      if (!usuario) return

      form.reset({
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      })
    } catch (err) {
      toast({
        title: "Erro ao carregar administrador",
        description: "Verifique a conexão ou tente novamente.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAdmin()
  }, [id])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      await axios.put(`http://localhost:3000/api/usuarios/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast({
        title: "Alterações salvas",
        description: "Administrador atualizado com sucesso.",
      })

      navigate("/dashboard/admin/lista")
    } catch (err) {
      toast({
        title: "Erro ao atualizar",
        description: "Verifique os dados ou tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout
      title="Editar Administrador"
      description="Atualize as informações do administrador."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@goop.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de usuário</FormLabel>
                <FormControl>
                  <select {...field} className="border rounded-md px-3 py-2">
                    <option value="admin">Administrador</option>
                    <option value="user">Usuário comum</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </Form>
    </DashboardLayout>
  )
}
