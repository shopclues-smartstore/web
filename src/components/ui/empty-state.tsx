import { cn } from "@/lib/utils"
import { Package, AlertTriangle } from "lucide-react"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-up",
        className
      )}
      {...props}
    >
      <div className="mb-4 rounded-full bg-muted p-4">
        {icon || <Package className="size-8 text-muted-foreground" />}
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}

export { EmptyState }
