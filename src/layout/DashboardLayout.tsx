import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden lg:pl-[260px] pt-10 pb-20 px-6 md:px-8 bg-goop-bg">
      <div className="max-w-[90rem] mx-auto space-y-6">
        {title && (
          <div className="space-y-1">
            <h1 className="text-3xl font-title font-bold text-goop">{title}</h1>
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
