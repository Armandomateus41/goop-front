import axios from "axios"

// Verifica o token no backend e retorna os dados do usuário autenticado
export async function fetchUserFromToken() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Token não encontrado")

  const response = await axios.get("http://localhost:3000/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data.user
}

// Faz login no backend e armazena o token e o usuário localmente
export async function loginRequest(email: string, password: string) {
  const response = await axios.post("http://localhost:3000/api/login", {
    email,
    password,
  })

  const { token, user } = response.data

  // Armazena os dados no localStorage
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))

  return user
}
