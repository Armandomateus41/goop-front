import Header from "@/layout/Header"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold">Administração</h2>
        <p className="text-muted-foreground">Área reservada para controle administrativo.</p>
      </main>
    </div>
  )
}
