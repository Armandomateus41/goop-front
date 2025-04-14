import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const pedidoSchema = z.object({
  cliente: z.string().min(2, "Nome obrigatório"),
  itens: z
    .array(
      z.object({
        nome: z.string().min(1, "Produto obrigatório"),
        quantidade: z.coerce.number().min(1, "Qtd mínima: 1"),
        preco: z.coerce.number().min(0.01, "Preço mínimo: R$ 0.01"),
      })
    )
    .min(1, "Adicione pelo menos 1 item"),
})

type PedidoFormData = z.infer<typeof pedidoSchema>

interface Props {
  modo?: "novo" | "editar"
  pedido?: any
}

export function PedidoForm({ modo = "novo", pedido }: Props) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: pedido || {
      cliente: "",
      itens: [{ nome: "", quantidade: 1, preco: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  })

  const total = form.watch("itens").reduce((acc, item) => {
    return acc + (item.quantidade || 0) * (item.preco || 0)
  }, 0)

  const onSubmit = async (data: PedidoFormData) => {
    const token = localStorage.getItem("token")
    const payload = {
      ...data,
      total: total.toFixed(2),
      status: pedido?.status || "PENDENTE",
      criadoEm: pedido?.criadoEm || new Date().toISOString(),
    }

    try {
      if (modo === "editar") {
        await axios.put(`http://localhost:3000/api/pedidos/${pedido._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast({
          title: "Pedido atualizado",
          description: "As alterações foram salvas com sucesso.",
        })
      } else {
        await axios.post("http://localhost:3000/api/pedidos", payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast({
          title: "Pedido criado",
          description: "O pedido foi salvo com sucesso.",
        })
      }

      navigate("/dashboard/pedidos")
    } catch (err) {
      console.error("Erro ao salvar pedido", err)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível concluir a operação.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: João da Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
              <FormField
                control={form.control}
                name={`itens.${index}.nome`}
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pastilha de freio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`itens.${index}.quantidade`}
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`itens.${index}.preco`}
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0.01" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <Button type="button" variant="destructive" onClick={() => remove(index)} className="w-full">
                  Remover
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={() => append({ nome: "", quantidade: 1, preco: 0 })}>
            + Adicionar Item
          </Button>

          <div className="text-right text-lg font-semibold">
            Total: R$ {total.toFixed(2)}
          </div>

          <Button type="submit" className="w-full">
            {modo === "editar" ? "Salvar Alterações" : "Criar Pedido"}
          </Button>
        </form>
      </Form>
    </Card>
  )
}
