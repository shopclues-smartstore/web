import { useLocation } from "react-router-dom"
import { EmptyState } from "@/components/ui/empty-state"
import { Construction } from "lucide-react"

export function PlaceholderPage() {
  const location = useLocation()
  const pageName = location.pathname.replace("/", "").replace(/-/g, " ")
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1)

  return (
    <div data-testid="placeholder-page">
      <EmptyState
        icon={<Construction className="size-8 text-muted-foreground" />}
        title={`${title} coming soon`}
        description={`The ${title.toLowerCase()} section is under development. Check back soon for updates.`}
      />
    </div>
  )
}
