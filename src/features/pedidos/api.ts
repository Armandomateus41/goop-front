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

  // ✅ Se o backend retorna apenas um array
  if (Array.isArray(data)) {
    return {
      pedidos: data,
      total: data.length,
      page: 1,
      pages: 1,
    }
  }

  // ✅ Se o backend retorna objeto com dados paginados
  return {
    pedidos: data.pedidos || [],
    total: data.total || 0,
    page: data.page || 1,
    pages: data.pages || 1,
  }
}
