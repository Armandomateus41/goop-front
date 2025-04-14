import axios from "axios"

export interface Pedido {
  _id: string
  cliente: string
  total: number
  status: "PENDENTE" | "PROCESSADO"
  criadoEm: string
  createdAt?: string
  updatedAt?: string
}

// GET básico (dashboard)
export async function getPedidos(): Promise<Pedido[]> {
  const token = localStorage.getItem("token")

  const response = await axios.get("http://localhost:3000/api/pedidos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = response.data

  // Caso a resposta seja um array diretamente
  if (Array.isArray(data)) {
    return data
  }

  // Caso venha paginado
  return data.pedidos || []
}

//  GET com paginação (listagem)
export async function getPedidosComPaginacao(
  page = 1,
  cliente?: string,
  status?: string
): Promise<{ pedidos: Pedido[]; total: number; page: number; pages: number }> {
  const token = localStorage.getItem("token")

  const response = await axios.get("http://localhost:3000/api/pedidos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      ...(cliente ? { cliente } : {}),
      ...(status && status !== "TODOS" ? { status } : {}),
    },
  })

  const data = response.data

  if (Array.isArray(data)) {
    return {
      pedidos: data,
      total: data.length,
      page: 1,
      pages: 1,
    }
  }

  return {
    pedidos: data.pedidos || [],
    total: data.total || 0,
    page: data.page || 1,
    pages: data.pages || 1,
  }
}

//  GET por ID
export async function getPedidoById(id: string): Promise<Pedido> {
  const token = localStorage.getItem("token")

  const response = await axios.get(`http://localhost:3000/api/pedidos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

//  POST
export async function createPedido(data: Omit<Pedido, "_id" | "criadoEm">): Promise<Pedido> {
  const token = localStorage.getItem("token")

  const response = await axios.post("http://localhost:3000/api/pedidos", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

//  PUT (edição)
export async function updatePedido(id: string, data: Partial<Pedido>): Promise<Pedido> {
  const token = localStorage.getItem("token")

  const response = await axios.put(`http://localhost:3000/api/pedidos/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

// PATCH (status)
export async function updatePedidoStatus(id: string, status: "PENDENTE" | "PROCESSADO"): Promise<void> {
  const token = localStorage.getItem("token")

  await axios.patch(
    `http://localhost:3000/api/pedidos/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

//  DELETE
export async function deletePedido(id: string): Promise<void> {
  const token = localStorage.getItem("token")

  await axios.delete(`http://localhost:3000/api/pedidos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
