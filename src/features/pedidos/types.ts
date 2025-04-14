export type PedidoStatus = 'PENDENTE' | 'PROCESSADO'

export interface PedidoItem {
  nome: string
  quantidade: number
  preco: number
}

export interface Pedido {
  id: string
  cliente: string
  itens: PedidoItem[]
  total: number
  status: PedidoStatus
  criadoEm: string
}