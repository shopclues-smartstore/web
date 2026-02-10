import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Store,
  ChevronDown,
  UserPlus,
  X,
  Check,
  Info,
  ArrowLeft,
  ArrowRight,
  Users,
  Shield,
  ClipboardList,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Role = "manager" | "ops" | "viewer"

interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  status: "invited" | "active"
}

const roleConfig: Record<Role, { label: string; description: string; icon: React.ElementType; color: string; bgColor: string }> = {
  manager: {
    label: "Manager",
    description: "Can manage products, inventory, and pricing.",
    icon: Shield,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  ops: {
    label: "Ops",
    description: "Can manage orders, shipments, and returns.",
    icon: ClipboardList,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access to reports and listings.",
    icon: Eye,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
}

const initialMembers: TeamMember[] = [
  { id: "1", name: "Alex Rivera", email: "alex@company.com", role: "manager", status: "active" },
  { id: "2", name: "Sam Chen", email: "sam@company.com", role: "ops", status: "invited" },
]

const onboardingSteps = [
  { label: "Store Details", done: true },
  { label: "Connect Marketplace", done: true },
  { label: "Add Team", done: false, active: true },
  { label: "Review & Sync", done: false },
]

export function AddTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("manager")
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const editDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false)
      }
      if (editDropdownRef.current && !editDropdownRef.current.contains(e.target as Node)) {
        setEditingRoleId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSendInvite = () => {
    if (!name.trim() || !email.trim()) return
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      role,
      status: "invited",
    }
    setMembers((prev) => [...prev, newMember])
    setSuccessBanner(email.trim())
    setName("")
    setEmail("")
    setRole("manager")
    setTimeout(() => setSuccessBanner(null), 4000)
  }

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const handleChangeRole = (id: string, newRole: Role) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    )
    setEditingRoleId(null)
  }

  const currentRoleConfig = roleConfig[role]

  return (
    <div className="min-h-screen bg-background" data-testid="add-team-page">
      {/* Top bar */}
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="size-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">SmartStore</span>
          </div>
          <span className="text-sm text-muted-foreground">Step 3 of 4</span>
        </div>
      </header>

      {/* Progress steps */}
      <div className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2" data-testid="onboarding-steps">
            {onboardingSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                {i > 0 && (
                  <div className={cn("h-px w-8", step.done || step.active ? "bg-primary" : "bg-border")} />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "size-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                      step.done
                        ? "bg-primary text-primary-foreground"
                        : step.active
                        ? "bg-primary/10 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.done ? <Check className="size-3.5" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      step.active ? "text-foreground" : step.done ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-up">
        {/* Title */}
        <div className="flex items-start gap-4 mb-8">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="size-6 text-primary" />
          </div>
          <div>
            <h1
              className="font-heading text-2xl font-bold tracking-tight text-foreground"
              data-testid="add-team-title"
            >
              Add your team
            </h1>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Invite teammates to help manage your store.
              <br />
              You can do this later.
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div
            data-testid="invite-success-banner"
            className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 animate-fade-up"
          >
            <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="size-4 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-emerald-800 flex-1">
              Invitation sent to <span className="font-semibold">{successBanner}</span>
            </p>
            <button
              data-testid="dismiss-success-banner"
              onClick={() => setSuccessBanner(null)}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Invite Form Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6 mb-6" data-testid="invite-form-card">
          <h2 className="font-heading text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <UserPlus className="size-4 text-primary" />
            Invite Team Member
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="member-name">Full Name</Label>
              <Input
                id="member-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="invite-name-input"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Email Address</Label>
              <Input
                id="member-email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="invite-email-input"
                className="h-10"
              />
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-2 mb-4">
            <Label>Role</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Owner (disabled) */}
              <div className="relative group">
                <button
                  disabled
                  data-testid="role-option-owner"
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground bg-muted/50 cursor-not-allowed opacity-60"
                >
                  <Shield className="size-4" />
                  Owner
                  <Info className="size-3 ml-1" />
                </button>
                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg bg-foreground text-primary-foreground text-xs p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  Owner role is assigned to the account creator and cannot be selected.
                </div>
              </div>

              {/* Selectable roles */}
              {(Object.keys(roleConfig) as Role[]).map((r) => {
                const config = roleConfig[r]
                const isSelected = role === r
                return (
                  <button
                    key={r}
                    data-testid={`role-option-${r}`}
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border text-foreground hover:bg-muted hover:border-primary/30"
                    )}
                  >
                    <config.icon className="size-4" />
                    {config.label}
                  </button>
                )
              })}
            </div>

            {/* Role description */}
            <div
              data-testid="role-description"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                currentRoleConfig.bgColor
              )}
            >
              <currentRoleConfig.icon className={cn("size-4 shrink-0", currentRoleConfig.color)} />
              <span className={currentRoleConfig.color}>{currentRoleConfig.description}</span>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="size-3" />
              Each role has predefined permissions. You can change roles anytime.
            </p>
          </div>

          <Button
            data-testid="send-invite-btn"
            onClick={handleSendInvite}
            disabled={!name.trim() || !email.trim()}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <UserPlus className="size-4 mr-2" />
            Send Invite
          </Button>
        </div>

        {/* Invited Members List */}
        {members.length > 0 && (
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-8" data-testid="team-members-list">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-heading text-base font-semibold text-foreground flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                Team Members
                <Badge variant="secondary" className="ml-1">{members.length}</Badge>
              </h2>
            </div>

            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_1fr_120px_100px_80px] gap-4 px-6 py-3 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {members.map((member) => {
                const mRole = roleConfig[member.role]
                return (
                  <div
                    key={member.id}
                    data-testid={`member-row-${member.id}`}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_120px_100px_80px] gap-2 sm:gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors duration-150"
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {member.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground truncate">{member.name}</span>
                    </div>

                    {/* Email */}
                    <span className="text-sm text-muted-foreground truncate">{member.email}</span>

                    {/* Role with inline change dropdown */}
                    <div className="relative" ref={editingRoleId === member.id ? editDropdownRef : undefined}>
                      <button
                        data-testid={`change-role-btn-${member.id}`}
                        onClick={() => setEditingRoleId(editingRoleId === member.id ? null : member.id)}
                        className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <mRole.icon className={cn("size-3.5", mRole.color)} />
                        {mRole.label}
                        <ChevronDown className={cn("size-3 text-muted-foreground transition-transform duration-200", editingRoleId === member.id && "rotate-180")} />
                      </button>
                      {editingRoleId === member.id && (
                        <div
                          data-testid={`role-dropdown-${member.id}`}
                          className="absolute top-full left-0 mt-1 w-44 bg-white border border-border rounded-xl shadow-lg p-1 z-20 animate-fade-up"
                        >
                          {(Object.keys(roleConfig) as Role[]).map((r) => {
                            const cfg = roleConfig[r]
                            return (
                              <button
                                key={r}
                                data-testid={`role-change-${member.id}-${r}`}
                                onClick={() => handleChangeRole(member.id, r)}
                                className={cn(
                                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                                  member.role === r
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-foreground hover:bg-muted"
                                )}
                              >
                                <cfg.icon className="size-4" />
                                {cfg.label}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      {member.status === "active" ? (
                        <Badge variant="success" data-testid={`status-badge-${member.id}`}>Active</Badge>
                      ) : (
                        <Badge variant="default" data-testid={`status-badge-${member.id}`}>Invited</Badge>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      data-testid={`remove-member-btn-${member.id}`}
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors duration-150 text-sm w-fit"
                      title="Remove member"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Skip Option */}
        <div className="text-center mb-10 py-4" data-testid="skip-section">
          <Link
            to="/dashboard"
            data-testid="skip-btn"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Skip for now
          </Link>
          <p className="text-xs text-muted-foreground mt-1.5">
            You can invite team members anytime from Settings.
          </p>
        </div>

        {/* Footer Navigation */}
        <div
          className="flex items-center justify-between border-t border-border pt-6"
          data-testid="footer-navigation"
        >
          <Button
            variant="outline"
            data-testid="back-btn"
            className="rounded-lg"
            asChild
          >
            <Link to="/dashboard">
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button
            data-testid="continue-btn"
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            asChild
          >
            <Link to="/dashboard">
              Continue to Review & Start Sync
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
