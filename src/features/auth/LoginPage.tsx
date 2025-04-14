import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormSchema, LoginFormValues } from "./loginFormSchema"
import { loginRequest } from "./authService"
import { useAuth } from "@/context/auth.context"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { user, setUserFromToken } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate("/dashboard")
  }, [user, navigate])

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError("")

    try {
      await loginRequest(data.email, data.password)
      await setUserFromToken()
      navigate("/dashboard")
    } catch {
      setError("Credenciais inválidas ou servidor indisponível.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url('/login.png')` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-goop/40 border border-white/20 rounded-xl shadow-xl p-8 w-full max-w-md space-y-6 text-white"
      >
        <div className="flex justify-center">
          <img src="/logo-goop.png" alt="Goop" className="h-20" />
        </div>

        <p className="text-center text-sm text-white/70">
          Acesse sua conta com seu e-mail e senha
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="armando@goop.com"
                      className="placeholder-white/70 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between text-white">
                    <span>Senha</span>
                    <a href="#" className="text-xs text-white/80 hover:underline">Esqueceu a senha?</a>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="placeholder-white/70 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-red-300 text-center">{error}</p>}

            <Button type="submit" className="w-full mt-2 bg-white text-goop font-semibold hover:bg-white/90" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-white/70">
          Não tem uma conta?{" "}
          <a href="#" className="underline text-white hover:text-white">Cadastre-se</a>
        </div>
      </motion.div>
    </div>
  )
}
