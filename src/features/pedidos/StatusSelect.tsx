import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { updatePedidoStatus } from "./api"
import { PedidoStatus } from "./types"

interface Props {
  id: string
  current: PedidoStatus
}

export function StatusSelect({ id, current }: Props) {
  const [status, setStatus] = useState<PedidoStatus>(current)

  const handleChange = async (value: string) => {
    // Garante que o valor é um status válido
    if (value === "PENDENTE" || value === "PROCESSADO") {
      setStatus(value as PedidoStatus)
      try {
        await updatePedidoStatus(id, value as PedidoStatus)
      } catch (err) {
        console.error("Erro ao atualizar status:", err)
      }
    } else {
      console.warn("Status inválido ignorado:", value)
    }
  }

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDENTE">Pendente</SelectItem>
        <SelectItem value="PROCESSADO">Processado</SelectItem>
      </SelectContent>
    </Select>
  )
}
