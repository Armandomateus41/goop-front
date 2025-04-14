import Sidebar from "@/layout/Sidebar"
import { useState } from "react"

export default function FontTestPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-goop-bg text-gray-800">
      <Sidebar onCollapseChange={setIsCollapsed} />

      <main
        className={`flex-1 p-10 space-y-6 transition-all`}
        style={{ marginLeft: isCollapsed ? 72 : 256 }}
      >
        <h1 className="text-4xl font-title text-goop">DM Sans - Título Grande</h1>
        <h2 className="text-2xl font-title font-semibold">DM Sans - Título Médio</h2>
        <h3 className="text-lg font-title font-medium">DM Sans - Subtítulo</h3>

        <p className="text-base font-sans mt-6">
          Inter - Parágrafo comum. Esse texto deve usar a fonte Inter, ideal para leitura de corpo,
          formulários e interfaces em geral.
        </p>

        <p className="text-sm font-sans font-light">
          Inter - Fonte leve (font-light). Ideal para descrições e textos auxiliares.
        </p>

        <p className="text-base font-sans font-semibold text-goop">
          Inter - Destaque com cor personalizada Goop.
        </p>
      </main>
    </div>
  )
}
