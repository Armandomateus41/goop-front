import DashboardLayout from "@/layout/DashboardLayout"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

const schema = z.object({
  nome: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  path: ["confirmarSenha"],
  message: "As senhas não coincidem",
})

type FormData = z.infer<typeof schema>

export default function NovoAdminPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  })

  const { toast } = useToast()

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post("http://localhost:3000/api/usuarios", {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      toast({
        title: "Administrador criado",
        description: "Cadastro realizado com sucesso.",
      })

      form.reset()
    } catch (err: any) {
      toast({
        title: "Erro ao cadastrar",
        description: err?.response?.data?.message || "Erro inesperado",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout
      title="Novo Administrador"
      description="Crie um novo acesso administrativo."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Ana Maria" {...field} />
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
                  <Input type="email" placeholder="admin@goop.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmarSenha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Cadastrar Administrador</Button>
        </form>
      </Form>
    </DashboardLayout>
  )
}
