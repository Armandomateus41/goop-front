import { z } from "zod"

export const itemSchema = z.object({
  nome: z.string().min(1, "Nome do produto é obrigatório"),
  quantidade: z.coerce.number().min(1, "Quantidade mínima é 1"),
  preco: z.coerce.number().min(0.01, "Preço mínimo é R$ 0,01"),
})

export const pedidoSchema = z.object({
  cliente: z.string().min(2, "Nome do cliente é obrigatório"),
  itens: z.array(itemSchema).min(1, "Adicione ao menos um item"),
})

// Tipos derivados do schema para uso no React Hook Form ou API
export type PedidoFormData = z.infer<typeof pedidoSchema>
export type ItemPedidoData = z.infer<typeof itemSchema>
