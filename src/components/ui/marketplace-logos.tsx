import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function AmazonLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[14px] w-auto", className)} viewBox="0 0 100 30" aria-label="Amazon" fill="none">
      <path d="M59.4 22.7c-5.5 4.1-13.5 6.2-20.3 6.2-9.6 0-18.3-3.6-24.9-9.5-.5-.5-.1-1.1.6-.7 7.1 4.1 15.8 6.6 24.9 6.6 6.1 0 12.8-1.3 19-3.9.9-.4 1.7.6.7 1.3z" fill="#FF9900"/>
      <path d="M61.7 20.2c-.7-.9-4.6-.4-6.4-.2-.5.1-.6-.4-.1-.7 3.1-2.2 8.2-1.6 8.8-.8.6.7-.2 5.9-3.1 8.3-.4.4-.9.2-.7-.3.7-1.6 2.1-5.3 1.5-6.3z" fill="#FF9900"/>
      <path d="M55.5 3.5V1.2c0-.4.3-.6.6-.6H67c.3 0 .6.3.6.6v2c0 .3-.3.8-.8 1.5L61.3 12.6c2-.1 4.2.3 6.1 1.3.4.2.5.6.6.9v2.5c0 .3-.4.7-.8.5-3.2-1.7-7.5-1.9-11.1 0-.4.2-.8-.2-.8-.5v-2.4c0-.4 0-1 .4-1.6l6.4-9.2h-5.6c-.3 0-.6-.2-.6-.6zM21.4 16.1h-3.2c-.3 0-.6-.2-.6-.5V1.1c0-.3.3-.6.6-.6h3c.3 0 .6.3.6.6v2h.1c.8-1.9 2.3-2.7 4.2-2.7 2 0 3.3.9 4.2 2.7.8-1.9 2.6-2.7 4.5-2.7 1.4 0 2.8.6 3.7 1.8 1 1.4.8 3.4.8 5.2v8.1c0 .3-.3.6-.6.6h-3.2c-.3 0-.6-.3-.6-.6V8.6c0-.7.1-2.4-.1-3.1-.2-1.1-1-1.4-1.9-1.4-.8 0-1.6.5-1.9 1.4-.3.8-.3 2.2-.3 3.2v6.9c0 .3-.3.6-.6.6h-3.2c-.3 0-.6-.3-.6-.6V8.6c0-1.8.3-4.5-2-4.5s-2.2 2.6-2.2 4.5v6.9c0 .3-.3.6-.6.6z" fill="#232F3E"/>
      <path d="M72.5.4c4.8 0 7.4 4.1 7.4 9.4 0 5.1-2.9 9.1-7.4 9.1-4.7 0-7.3-4.1-7.3-9.3S67.9.4 72.5.4zm0 3.4c-2.4 0-2.5 3.3-2.5 5.3s0 6.4 2.5 6.4 2.6-3.5 2.6-5.6c0-1.4-.1-3.1-.5-4.4-.3-1.2-1-1.7-2.1-1.7z" fill="#232F3E"/>
      <path d="M86 16.1h-3.2c-.3 0-.6-.3-.6-.6V1c0-.3.3-.5.6-.5h3c.3 0 .5.2.6.5v2.2h.1c.9-2 2.2-3 4.4-3 1.4 0 2.9.5 3.8 2 .8 1.3.8 3.6.8 5.2v8c0 .3-.3.5-.6.5h-3.3c-.3 0-.5-.2-.6-.5V8.4c0-1.8.2-4.5-2-4.5-.8 0-1.5.5-1.9 1.3-.4 1-.5 2-.5 3.2v7.1c0 .3-.3.6-.6.6z" fill="#232F3E"/>
      <path d="M48.4 9.3c0 1.2 0 2.3-.6 3.4-.5.9-1.3 1.4-2.2 1.4-1.2 0-2-.9-2-2.3 0-2.7 2.5-3.2 4.8-3.2v.7zm3.3 7.8c-.2.2-.5.2-.8.1-1.1-.9-1.3-1.3-1.9-2.2-1.8 1.8-3.1 2.4-5.4 2.4-2.7 0-4.9-1.7-4.9-5.1 0-2.6 1.4-4.4 3.5-5.3 1.8-.8 4.3-.9 6.2-1.1v-.4c0-.8.1-1.7-.4-2.4-.4-.6-1.2-.8-1.9-.8-1.3 0-2.4.7-2.7 2-.1.3-.3.6-.6.6l-3.1-.3c-.3-.1-.6-.3-.5-.7C40.1 1.1 43.8 0 47.1 0c1.7 0 3.9.4 5.2 1.7 1.7 1.6 1.5 3.7 1.5 6v5.4c0 1.6.7 2.3 1.3 3.2.2.3.3.7 0 .9-.7.6-2 1.7-2.7 2.3l-.1-.4z" fill="#232F3E"/>
    </svg>
  )
}

export function FlipkartLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[14px] w-auto", className)} viewBox="0 0 70 18" aria-label="Flipkart" fill="none">
      <path d="M7.2 0H8c1.4.2 2.5 1.5 2.5 2.9v7.3h2c.7 0 1.2.2 1.6.6.6.7.7 1.7.3 2.5L8.2 24c-.4.7-1.3 1.1-2.1.9-.8-.2-1.4-1-1.4-1.8v-9h-2c-.7 0-1.2-.2-1.6-.7-.6-.6-.7-1.6-.3-2.3L7.2 0z" fill="#2874F0" transform="scale(0.55) translate(0,2)"/>
      <text x="12" y="14" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="700" fontSize="13.5" fill="#2874F0" letterSpacing="-0.3">Flipkart</text>
    </svg>
  )
}

export function MeeshoLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[14px] w-auto", className)} viewBox="0 0 68 16" aria-label="Meesho" fill="none">
      <text x="0" y="13" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="800" fontSize="14" fill="#E8318A" letterSpacing="-0.5">meesho</text>
    </svg>
  )
}

export function WishLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[14px] w-auto", className)} viewBox="0 0 42 16" aria-label="Wish" fill="none">
      <text x="0" y="13" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="700" fontSize="14" fill="#2FB7EC" letterSpacing="-0.3">Wish</text>
    </svg>
  )
}

export function CoupangLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[14px] w-auto", className)} viewBox="0 0 80 16" aria-label="Coupang" fill="none">
      <text x="0" y="13" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="700" fontSize="14" fill="#E42529" letterSpacing="-0.3">coupang</text>
    </svg>
  )
}

export function SnapdealLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[14px] w-auto", className)} viewBox="0 0 78 16" aria-label="Snapdeal" fill="none">
      <text x="0" y="13" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="700" fontSize="14" fill="#E40046" letterSpacing="-0.3">snapdeal</text>
    </svg>
  )
}

export function MyntraLogo({ className }: LogoProps) {
  return (
    <svg className={cn("h-[14px] w-auto", className)} viewBox="0 0 56 16" aria-label="Myntra" fill="none">
      <text x="0" y="13" fontFamily="system-ui,-apple-system,sans-serif" fontWeight="800" fontSize="13" fill="#FF3F6C" letterSpacing="-0.3">Myntra</text>
    </svg>
  )
}

export const marketplaceLogos: Record<string, { Logo: React.FC<LogoProps>; bgColor: string }> = {
  amazon: { Logo: AmazonLogo, bgColor: "bg-orange-50 border-orange-100" },
  flipkart: { Logo: FlipkartLogo, bgColor: "bg-blue-50 border-blue-100" },
  meesho: { Logo: MeeshoLogo, bgColor: "bg-pink-50 border-pink-100" },
  wish: { Logo: WishLogo, bgColor: "bg-cyan-50 border-cyan-100" },
  coupang: { Logo: CoupangLogo, bgColor: "bg-red-50 border-red-100" },
  snapdeal: { Logo: SnapdealLogo, bgColor: "bg-rose-50 border-rose-100" },
  myntra: { Logo: MyntraLogo, bgColor: "bg-pink-50 border-pink-100" },
}
