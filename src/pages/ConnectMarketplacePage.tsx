import { useState } from 'react';

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Lock,
  ShoppingBag,
  X,
} from 'lucide-react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  getOnboardingSteps,
  OnboardingLayout,
} from '@/components/onboarding/OnboardingLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

interface Marketplace {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  status: ConnectionStatus;
  disabled?: boolean;
  icon?: string;
}

const initialMarketplaces: Marketplace[] = [
  {
    id: "amazon",
    name: "Amazon",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    status: "idle",
    icon: "/brands/amazon.svg",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    status: "idle",
    icon: "/brands/flipkart.svg",
  },
  {
    id: "meesho",
    name: "Meesho",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    status: "idle",
  },
  {
    id: "wish",
    name: "Wish",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    status: "idle",
    icon: "/brands/wish.svg",
  },
  {
    id: "coupang",
    name: "Coupang",
    color: "text-red-600",
    bgColor: "bg-red-50",
    status: "idle",
    icon: "/brands/coupang.svg",
  },
  {
    id: "gmarket",
    name: "Gmarket",
    color: "text-green-600",
    bgColor: "bg-green-50",
    status: "idle",
    icon: "/brands/gmarket.svg",
  },
  {
    id: "noon",
    name: "Noon",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    status: "idle",
    icon: "/brands/noon.svg",
  },
  {
    id: "ondc",
    name: "ONDC",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    status: "idle",
    icon: "/brands/ondc.svg",
  },
  {
    id: "shopclues",
    name: "ShopClues",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    status: "idle",
    icon: "/brands/shopclues.svg",
  },
];

export function ConnectMarketplacePage() {
  const navigate = useNavigate();
  const [marketplaces, setMarketplaces] =
    useState<Marketplace[]>(initialMarketplaces);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [region, setRegion] = useState("");
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  const hasAnyConnected = marketplaces.some((m) => m.status === "connected");
  const selectedMp = marketplaces.find((m) => m.id === selectedId);

  const updateStatus = (id: string, status: ConnectionStatus) => {
    setMarketplaces((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m)),
    );
  };

  const handleTestConnection = () => {
    if (!selectedId) return;
    updateStatus(selectedId, "connecting");
    setTimeout(() => {
      // Simulate: 80% success, 20% error
      const success = Math.random() > 0.2;
      updateStatus(selectedId, success ? "connected" : "error");
      if (success) {
        setTimeout(() => {
          setSelectedId(null);
          setApiKey("");
          setSellerId("");
          setRegion("");
        }, 800);
      }
    }, 2000);
  };

  const handleConnect = () => {
    if (!selectedId) return;
    updateStatus(selectedId, "connecting");
    setTimeout(() => {
      updateStatus(selectedId, "connected");
      setTimeout(() => {
        setSelectedId(null);
        setApiKey("");
        setSellerId("");
        setRegion("");
      }, 600);
    }, 1500);
  };

  const handleRetry = (id: string) => {
    updateStatus(id, "idle");
    setSelectedId(id);
  };

  const handleCardClick = (mp: Marketplace) => {
    if (mp.disabled) return;
    if (mp.status === "connected") return;
    if (mp.status === "error") {
      handleRetry(mp.id);
      return;
    }
    setSelectedId(mp.id === selectedId ? null : mp.id);
    setApiKey("");
    setSellerId("");
    setRegion("");
  };

  const handleContinue = () => {
    if (!hasAnyConnected) {
      setShowSkipWarning(true);
      return;
    }
    navigate("/onboarding/review");
  };

  const handleSkipContinue = () => {
    navigate("/onboarding/review");
  };

  return (
    <OnboardingLayout steps={getOnboardingSteps(2)} currentStep={3} totalSteps={4}>
      <div data-testid="connect-marketplace-page">
        {/* Title */}
        <div className="flex items-start gap-4 mb-8">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ShoppingBag className="size-6 text-primary" />
          </div>
          <div>
            <h1
              className="font-heading text-2xl font-bold tracking-tight text-foreground"
              data-testid="connect-marketplace-title"
            >
              Connect your marketplaces
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              We'll import your products, inventory, and orders automatically.
            </p>
          </div>
        </div>

        {/* Skip Warning */}
        {showSkipWarning && (
          <div
            data-testid="skip-warning-banner"
            className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 animate-fade-up"
          >
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                No marketplaces connected
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                You can continue without connecting, but you'll need to connect
                at least one marketplace to start syncing.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  data-testid="skip-warning-continue"
                  onClick={handleSkipContinue}
                  className="rounded-lg text-xs"
                >
                  Continue anyway
                </Button>
                <Button
                  size="sm"
                  data-testid="skip-warning-dismiss"
                  onClick={() => setShowSkipWarning(false)}
                  className="rounded-lg text-xs"
                >
                  Connect a marketplace
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShowSkipWarning(false)}
              className="text-amber-600 hover:text-amber-800"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Marketplace Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
          data-testid="marketplace-grid"
        >
          {marketplaces.map((mp) => (
            <button
              key={mp.id}
              data-testid={`marketplace-card-${mp.id}`}
              onClick={() => handleCardClick(mp)}
              disabled={mp.disabled}
              className={cn(
                "relative flex items-center justify-center rounded-xl border p-5 transition-all duration-200 min-h-[80px]",
                mp.disabled && "opacity-50 cursor-not-allowed",
                mp.status === "connected" &&
                  "border-emerald-300 bg-emerald-50/50",
                mp.status === "connecting" && "border-primary/40 bg-primary/5",
                mp.status === "error" && "border-red-300 bg-red-50/50",
                mp.status === "idle" &&
                  !mp.disabled &&
                  "border-border bg-white hover:border-primary/40 hover:shadow-sm cursor-pointer",
                selectedId === mp.id &&
                  mp.status === "idle" &&
                  "border-primary bg-primary/5 shadow-sm",
              )}
            >
              {/* Status badge */}
              {mp.status === "connected" && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                </div>
              )}
              {mp.status === "connecting" && (
                <div className="absolute top-2 right-2">
                  <Loader2 className="size-5 text-primary animate-spin" />
                </div>
              )}
              {mp.status === "error" && (
                <div className="absolute top-2 right-2">
                  <AlertTriangle className="size-5 text-red-500" />
                </div>
              )}

              {mp.icon ? (
                <img
                  src={mp.icon}
                  alt={mp.name}
                  className="h-7 w-auto object-contain"
                />
              ) : (
                <span
                  className={cn("font-heading text-base font-bold", mp.color)}
                >
                  {mp.name}
                </span>
              )}

              {mp.status === "connected" && (
                <Badge variant="success" className="text-xs">
                  Connected
                </Badge>
              )}
              {mp.status === "error" && (
                <span className="text-xs text-red-600 font-medium">Retry</span>
              )}
            </button>
          ))}
        </div>

        {/* Connection Panel */}
        {selectedId && selectedMp && selectedMp.status !== "connected" && (
          <div
            data-testid="connection-panel"
            className="bg-white border border-border rounded-2xl shadow-sm p-6 mb-6 animate-fade-up"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-base font-semibold flex items-center gap-2">
                Connect to {selectedMp.name}
              </h3>
              <button
                data-testid="close-connection-panel"
                onClick={() => setSelectedId(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Auth Token / API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Paste your API key here"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  data-testid="api-key-input"
                  className="h-10"
                />
                <a
                  href="#"
                  data-testid="token-help-link"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  How do I generate this token?
                  <ExternalLink className="size-3" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seller-id">Seller ID (optional)</Label>
                  <Input
                    id="seller-id"
                    placeholder="e.g. A1B2C3D4"
                    value={sellerId}
                    onChange={(e) => setSellerId(e.target.value)}
                    data-testid="seller-id-input"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region (optional)</Label>
                  <Input
                    id="region"
                    placeholder="e.g. IN, US"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    data-testid="region-input"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Error state */}
              {selectedMp.status === "error" && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertTriangle className="size-4 shrink-0" />
                  Connection failed. Please check your credentials and try
                  again.
                </div>
              )}

              {/* Security note */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                <Lock className="size-3.5 shrink-0" />
                Your credentials are encrypted and secure.
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  data-testid="test-connection-btn"
                  onClick={handleTestConnection}
                  disabled={!apiKey || selectedMp.status === "connecting"}
                  className="rounded-lg"
                >
                  {selectedMp.status === "connecting" ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test connection"
                  )}
                </Button>
                <Button
                  data-testid="connect-btn"
                  onClick={handleConnect}
                  disabled={!apiKey || selectedMp.status === "connecting"}
                  className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {selectedMp.status === "connecting" ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Connected summary */}
        {hasAnyConnected && (
          <div
            className="flex items-center gap-2 mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3"
            data-testid="connected-summary"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            {marketplaces.filter((m) => m.status === "connected").length}{" "}
            marketplace(s) connected successfully.
          </div>
        )}

        {/* Footer */}
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
            <Link to="/onboarding/store-details">
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
        </div>
      </div>
    </OnboardingLayout>
  );
}
