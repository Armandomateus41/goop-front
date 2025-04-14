import { useAuth } from "@/context/auth.context"

export default function Header() {
  const { user, logout, loading } = useAuth()

  if (loading) return null // Evita piscar info antes da verificação

  return (
    <header className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow">
      <div>
        <h1 className="text-xl font-bold">Goop Distribuidora</h1>
        {user && <p className="text-sm">Olá, {user.name}</p>}
      </div>
      <button
        onClick={logout}
        className="bg-white text-primary px-4 py-1 rounded hover:bg-gray-100 text-sm"
      >
        Sair
      </button>
    </header>
  )
}
