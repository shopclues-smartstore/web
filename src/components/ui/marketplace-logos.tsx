import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function AmazonLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[16px] w-auto", className)} viewBox="0 0 80 24" aria-label="Amazon" fill="none">
      {/* "amazon" wordmark */}
      <text x="0" y="15" fontFamily="'Amazon Ember', 'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="16" fill="#232F3E" letterSpacing="-0.5">amazon</text>
      {/* ".in" suffix */}
      <text x="56" y="15" fontFamily="'Amazon Ember', 'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="16" fill="#232F3E" letterSpacing="-0.5">.in</text>
      {/* Orange smile/arrow */}
      <path d="M8 19 Q22 24 42 19" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M40 16 L43 19 L39 20" fill="#FF9900"/>
    </svg>
  )
}

export function FlipkartLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[16px] w-auto", className)} viewBox="0 0 78 20" aria-label="Flipkart" fill="none">
      {/* "Flipkart" wordmark */}
      <text x="0" y="15" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="16" fill="#2874F0" letterSpacing="-0.3">Flipkart</text>
      {/* Yellow accent dot */}
      <circle cx="72" cy="4" r="2.5" fill="#FFE500"/>
    </svg>
  )
}

export function MeeshoLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[16px] w-auto", className)} viewBox="0 0 72 18" aria-label="Meesho" fill="none">
      <text x="0" y="14" fontFamily="'Poppins', 'Helvetica Neue', Arial, sans-serif" fontWeight="800" fontSize="15" fill="#570A57" letterSpacing="-0.4">meesho</text>
    </svg>
  )
}

export function WishLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[16px] w-auto", className)} viewBox="0 0 48 18" aria-label="Wish" fill="none">
      <text x="0" y="14" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="16" fill="#2FB7EC" letterSpacing="-0.3">Wish</text>
    </svg>
  )
}

export function CoupangLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[16px] w-auto", className)} viewBox="0 0 82 18" aria-label="Coupang" fill="none">
      <text x="0" y="14" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize="15" fill="#E42529" letterSpacing="-0.2">coupang</text>
    </svg>
  )
}

export function SnapdealLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[16px] w-auto", className)} viewBox="0 0 84 18" aria-label="Snapdeal" fill="none">
      {/* Red circle burst */}
      <circle cx="7" cy="9" r="6" fill="#E40046"/>
      <line x1="7" y1="2" x2="7" y2="4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="13.5" x2="7" y2="16" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="1" y1="9" x2="3.5" y2="9" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="10.5" y1="9" x2="13" y2="9" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <text x="16" y="14" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="600" fontSize="14" fill="#E40046" letterSpacing="-0.3">snapdeal</text>
    </svg>
  )
}

export function MyntraLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[16px] w-auto", className)} viewBox="0 0 64 18" aria-label="Myntra" fill="none">
      {/* Stylized M shape */}
      <path d="M2 16 L5 3 L9.5 10 L14 3 L17 16" stroke="#FF3F6C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <text x="20" y="15" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="800" fontSize="14" fill="#FF3F6C" letterSpacing="-0.5">yntra</text>
    </svg>
  )
}

// Marketplace name labels (human-readable)
export const marketplaceNames: Record<string, string> = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  meesho: "Meesho",
  wish: "Wish",
  coupang: "Coupang",
  snapdeal: "Snapdeal",
  myntra: "Myntra",
}

export const marketplaceLogos: Record<string, { Logo: React.FC<LogoProps>; bgColor: string }> = {
  amazon: { Logo: AmazonLogo, bgColor: "bg-orange-50 border-orange-100" },
  flipkart: { Logo: FlipkartLogo, bgColor: "bg-blue-50 border-blue-100" },
  meesho: { Logo: MeeshoLogo, bgColor: "bg-purple-50 border-purple-100" },
  wish: { Logo: WishLogo, bgColor: "bg-cyan-50 border-cyan-100" },
  coupang: { Logo: CoupangLogo, bgColor: "bg-red-50 border-red-100" },
  snapdeal: { Logo: SnapdealLogo, bgColor: "bg-rose-50 border-rose-100" },
  myntra: { Logo: MyntraLogo, bgColor: "bg-pink-50 border-pink-100" },
}
