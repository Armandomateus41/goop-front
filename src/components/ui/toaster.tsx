"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import * as React from "react"

type ToastType = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

const ToastContext = React.createContext<{
  toasts: ToastType[]
  toast: (data: Omit<ToastType, "id">) => void
}>({
  toasts: [],
  toast: () => {},
})

export const Toaster: React.FC = () => {
  const { toasts } = React.useContext(ToastContext)

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export const ToastWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const toast = (data: Omit<ToastType, "id">) => {
    const newToast = { ...data, id: crypto.randomUUID() }
    setToasts((prev) => [...prev, newToast])
  }

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  return React.useContext(ToastContext)
}
