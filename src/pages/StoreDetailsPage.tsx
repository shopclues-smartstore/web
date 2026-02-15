import { useState } from "react";

import { ArrowLeft, ArrowRight, Building2, Info, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  getOnboardingSteps,
  OnboardingLayout,
} from "@/components/onboarding/OnboardingLayout";
import {
  CountryPicker,
  CurrencyPicker,
  TimezonePicker,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateWorkspaceMutation } from "@/lib/graphql/generated/types";
import { COUNTRIES, type Country } from "@/shared/constants/countries";

const defaultCountry = COUNTRIES.find((c) => c.code === "IN") ?? COUNTRIES[0];
const CURRENCIES = [...new Set(COUNTRIES.map((c) => c.currency))].sort();
const TIMEZONES = [...new Set(COUNTRIES.map((c) => c.timezone))].sort();

export function StoreDetailsPage() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("Ravi Kumar Sha");
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [currency, setCurrency] = useState(defaultCountry.currency);
  const [timezone, setTimezone] = useState(defaultCountry.timezone);
  const [taxId, setTaxId] = useState("06ELGPS3107F1Z8");
  const [createWorkspaceMutation, { loading: creating }] =
    useCreateWorkspaceMutation();

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setCurrency(country.currency);
    setTimezone(country.timezone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = storeName.trim();
    if (!name) {
      toast.error("Please enter a store or brand name.");
      return;
    }

    try {
      const result = await createWorkspaceMutation({
        variables: {
          input: {
            name,
            country: selectedCountry.code,
            currency,
            timezone,
            taxId,
          },
        },
      });
      const data = result.data as
        | { createWorkspace?: { workspace?: unknown } }
        | undefined;
      if (data?.createWorkspace?.workspace) {
        toast.success("Store details saved.");
        navigate("/onboarding/choose-plan");
      } else if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    }
  };

  return (
    <OnboardingLayout
      steps={getOnboardingSteps(0)}
      currentStep={1}
      totalSteps={4}
      wide
      footer={
        <>
          <Button
            variant="outline"
            data-testid="back-btn"
            className="rounded-lg"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button
            type="submit"
            form="store-details-form"
            data-testid="continue-btn"
            disabled={creating}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            {creating ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <ArrowRight className="size-4 mr-2" />
            )}
            Continue
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
          <h1
            className="font-heading text-3xl font-bold tracking-tight text-foreground"
            data-testid="store-details-title"
          >
            Tell us about your store
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-md mx-auto">
            This helps us set things up correctly for you.
          </p>
        </div>
        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
          <form
            id="store-details-form"
            onSubmit={handleSubmit}
            className="bg-white border border-border rounded-2xl shadow-sm p-6 sm:p-8 mb-6"
            data-testid="store-form-card"
          >
            <fieldset
              className="border-0 p-0 m-0 min-w-0 disabled:opacity-70 disabled:pointer-events-none"
              disabled={creating}
            >
              <div className="space-y-5">
                {/* GST Number – fetch business details */}
                <div className="space-y-2">
                  <Label htmlFor="tax-id">GST Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tax-id"
                      placeholder="e.g. 29AABCU9603R1ZM"
                      value={taxId}
                      onChange={(e) => {
                        setTaxId(e.target.value);
                      }}
                      data-testid="tax-id-input"
                      className="h-10 flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your 15-character GSTIN to auto-fill business name.
                  </p>
                </div>
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
                  <CountryPicker
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    data-testid="country"
                  />
                </div>

                {/* Currency + Timezone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <CurrencyPicker
                      value={currency}
                      onChange={setCurrency}
                      currencies={CURRENCIES}
                      data-testid="currency"
                    />
                    <p className="text-xs text-muted-foreground">
                      Defaults to INR
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <TimezonePicker
                      value={timezone}
                      onChange={setTimezone}
                      timezones={TIMEZONES}
                      data-testid="timezone"
                    />
                    <p className="text-xs text-muted-foreground">
                      Defaults to Asia/Kolkata
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>

          {/* Helper text */}
          <p className="text-xs text-muted-foreground text-center mb-8 flex items-center justify-center gap-1">
            <Info className="size-3" />
            You can change these later from Settings.
          </p>
        </div>{" "}
        {/* end max-w-2xl */}
      </div>
    </OnboardingLayout>
  );
}
