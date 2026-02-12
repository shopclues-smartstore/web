import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronDown,
  Info,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { OnboardingLayout, getOnboardingSteps } from "@/components/onboarding/OnboardingLayout"

const countries = [
  { code: "IN", name: "India", currency: "INR", timezone: "Asia/Kolkata" },
  { code: "US", name: "United States", currency: "USD", timezone: "America/New_York" },
  { code: "GB", name: "United Kingdom", currency: "GBP", timezone: "Europe/London" },
  { code: "DE", name: "Germany", currency: "EUR", timezone: "Europe/Berlin" },
  { code: "SG", name: "Singapore", currency: "SGD", timezone: "Asia/Singapore" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", timezone: "Asia/Dubai" },
  { code: "AU", name: "Australia", currency: "AUD", timezone: "Australia/Sydney" },
]

const marketplaces = [
  "Amazon", "Flipkart", "Meesho", "Shopify", "eBay", "Etsy", "Wish"
]

export function StoreDetailsPage() {
  const navigate = useNavigate()
  const [storeName, setStoreName] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [countryOpen, setCountryOpen] = useState(false)
  const [currency, setCurrency] = useState(countries[0].currency)
  const [timezone, setTimezone] = useState(countries[0].timezone)
  const [marketplace, setMarketplace] = useState("")
  const [marketplaceOpen, setMarketplaceOpen] = useState(false)
  const [optionalOpen, setOptionalOpen] = useState(false)
  const [businessType, setBusinessType] = useState<"individual" | "company">("individual")
  const [taxId, setTaxId] = useState("")

  const countryRef = useRef<HTMLDivElement>(null)
  const marketplaceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false)
      if (marketplaceRef.current && !marketplaceRef.current.contains(e.target as Node)) setMarketplaceOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country)
    setCurrency(country.currency)
    setTimezone(country.timezone)
    setCountryOpen(false)
  }

  const handleContinue = () => {
    navigate("/onboarding/connect-marketplace")
  }

  return (
    <OnboardingLayout
      steps={getOnboardingSteps(1)}
      currentStep={2}
      totalSteps={4}
      wide
      footer={
        <>
          <Button variant="outline" data-testid="back-btn" className="rounded-lg" asChild>
            <Link to="/onboarding/choose-plan">
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button
            data-testid="continue-btn"
            onClick={handleContinue}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Continue
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </>
      }
    >
      <div data-testid="store-details-page">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Building2 className="size-7 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground" data-testid="store-details-title">
            Tell us about your store
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-md mx-auto">
            This helps us set things up correctly for you.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-border rounded-2xl shadow-sm p-6 sm:p-8 mb-6" data-testid="store-form-card">
          <div className="space-y-5">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="store-name">Store / Brand Name</Label>
              <Input
                id="store-name"
                placeholder="e.g. My Awesome Store"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                data-testid="store-name-input"
                className="h-10"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label>Business Country</Label>
              <div ref={countryRef} className="relative">
                <button
                  data-testid="country-selector"
                  onClick={() => setCountryOpen(!countryOpen)}
                  className="flex w-full items-center justify-between rounded-md border border-input bg-transparent h-10 px-3 text-sm shadow-sm hover:bg-muted/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{flagEmoji(selectedCountry.code)}</span>
                    {selectedCountry.name}
                  </span>
                  <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", countryOpen && "rotate-180")} />
                </button>
                {countryOpen && (
                  <div data-testid="country-dropdown" className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg p-1 z-20 animate-fade-up max-h-56 overflow-y-auto">
                    {countries.map((c) => (
                      <button
                        key={c.code}
                        data-testid={`country-option-${c.code}`}
                        onClick={() => handleCountrySelect(c)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                          selectedCountry.code === c.code ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span className="text-base">{flagEmoji(c.code)}</span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Currency + Timezone row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Input
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  data-testid="currency-input"
                  className="h-10 bg-muted/30"
                />
                <p className="text-xs text-muted-foreground">Auto-selected based on country</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  data-testid="timezone-input"
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">Auto-selected, editable</p>
              </div>
            </div>

            {/* Primary Marketplace */}
            <div className="space-y-2">
              <Label>Primary Selling Marketplace</Label>
              <div ref={marketplaceRef} className="relative">
                <button
                  data-testid="marketplace-selector"
                  onClick={() => setMarketplaceOpen(!marketplaceOpen)}
                  className="flex w-full items-center justify-between rounded-md border border-input bg-transparent h-10 px-3 text-sm shadow-sm hover:bg-muted/50 transition-colors"
                >
                  <span className={marketplace ? "text-foreground" : "text-muted-foreground"}>
                    {marketplace || "Select your primary marketplace"}
                  </span>
                  <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", marketplaceOpen && "rotate-180")} />
                </button>
                {marketplaceOpen && (
                  <div data-testid="marketplace-dropdown" className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg p-1 z-20 animate-fade-up">
                    {marketplaces.map((m) => (
                      <button
                        key={m}
                        data-testid={`marketplace-option-${m.toLowerCase()}`}
                        onClick={() => { setMarketplace(m); setMarketplaceOpen(false) }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                          marketplace === m ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Optional Section */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-6" data-testid="optional-section">
          <button
            data-testid="optional-toggle"
            onClick={() => setOptionalOpen(!optionalOpen)}
            className="flex w-full items-center justify-between px-6 sm:px-8 py-4 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Info className="size-4 text-muted-foreground" />
              Additional details (optional)
            </span>
            {optionalOpen ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
          </button>
          {optionalOpen && (
            <div className="px-6 sm:px-8 pb-5 pt-0 space-y-5 border-t border-border animate-fade-up" data-testid="optional-fields">
              {/* Business Type */}
              <div className="space-y-2 pt-4">
                <Label>Business Type</Label>
                <div className="flex gap-3">
                  {(["individual", "company"] as const).map((t) => (
                    <button
                      key={t}
                      data-testid={`business-type-${t}`}
                      onClick={() => setBusinessType(t)}
                      className={cn(
                        "flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        businessType === t
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border text-foreground hover:bg-muted"
                      )}
                    >
                      {t === "individual" ? "Individual" : "Company"}
                    </button>
                  ))}
                </div>
              </div>

              {/* GST / Tax ID */}
              <div className="space-y-2">
                <Label htmlFor="tax-id">GST / Tax ID (optional)</Label>
                <Input
                  id="tax-id"
                  placeholder="e.g. 29AABCU9603R1ZM"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  data-testid="tax-id-input"
                  className="h-10"
                />
              </div>
            </div>
          )}
        </div>

        {/* Helper text */}
        <p className="text-xs text-muted-foreground text-center mb-8 flex items-center justify-center gap-1">
          <Info className="size-3" />
          You can change these later from Settings.
        </p>
        </div> {/* end max-w-2xl */}
      </div>
    </OnboardingLayout>
  )
}

function flagEmoji(countryCode: string): string {
  const map: Record<string, string> = {
    IN: "\u{1F1EE}\u{1F1F3}", US: "\u{1F1FA}\u{1F1F8}", GB: "\u{1F1EC}\u{1F1E7}",
    DE: "\u{1F1E9}\u{1F1EA}", SG: "\u{1F1F8}\u{1F1EC}", AE: "\u{1F1E6}\u{1F1EA}",
    AU: "\u{1F1E6}\u{1F1FA}",
  }
  return map[countryCode] ?? ""
}
