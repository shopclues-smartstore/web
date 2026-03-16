import type { SubscriptionPlansQuery } from '@/lib/graphql/generated/types';

import type { Plan } from './types';
import { PLAN_STYLES } from './types';

type ApiPlan = SubscriptionPlansQuery['subscriptionPlans'][number];

/**
 * Transforms API subscription plan data into UI format
 */
export function transformPlanToUI(apiPlan: ApiPlan): Plan | null {
  const code = apiPlan.code.toUpperCase();
  const styles = PLAN_STYLES[code];
  
  if (!styles) {
    console.warn(`Unknown plan code: ${code}`);
    return null;
  }

  // Extract price from entitlements (look for price-related entitlements)
  // If not found, use default pricing based on plan code
  const priceEntitlement = apiPlan.entitlements.find(
    (e) => e.key.toLowerCase().includes("price") || e.key.toLowerCase().includes("cost"),
  );
  
  let price = "$0";
  let period = "/month";
  
  if (priceEntitlement) {
    if (priceEntitlement.valueInt !== null && priceEntitlement.valueInt !== undefined) {
      price = `$${priceEntitlement.valueInt}`;
    } else if (priceEntitlement.valueText) {
      price = priceEntitlement.valueText;
    }
    if (priceEntitlement.unit) {
      period = `/${priceEntitlement.unit}`;
    }
  } else {
    // Fallback to default pricing
    const defaultPricing: Record<string, { price: string; period: string }> = {
      FREE: { price: "$0", period: "/month" },
      SILVER: { price: "$29", period: "/month" },
      GOLD: { price: "$79", period: "/month" },
      PLATINUM: { price: "$199", period: "/month" },
    };
    const defaultPrice = defaultPricing[code];
    if (defaultPrice) {
      price = defaultPrice.price;
      period = defaultPrice.period;
    }
  }

  // Extract promo text from entitlements
  // TODO: When backend adds billing.promoText field to SubscriptionPlan, update GraphQL query
  // and extract directly from apiPlan.billing?.promoText instead
  const promoTextEntitlement = apiPlan.entitlements.find(
    (e) => {
      const key = e.key.toLowerCase();
      return (
        key === "promo_text" ||
        key === "billing_promo_text" ||
        key.includes("promo") ||
        (e.valueJson && typeof e.valueJson === "object" && "promoText" in e.valueJson)
      );
    },
  );
  
  let promoText: string | undefined;
  if (promoTextEntitlement) {
    if (promoTextEntitlement.valueText) {
      promoText = promoTextEntitlement.valueText;
    } else if (promoTextEntitlement.valueJson && typeof promoTextEntitlement.valueJson === "object") {
      const json = promoTextEntitlement.valueJson as Record<string, unknown>;
      promoText = (json.promoText || json.promo_text) as string | undefined;
    }
  }

  // Transform entitlements to features for summary view
  // Summary view shows entitlements with displayType === 'BOTH'
  const features = apiPlan.entitlements
    .filter((e) => {
      // Filter out price-related and promo-related entitlements
      const key = e.key.toLowerCase();
      const isPriceOrPromo = key.includes("price") || key.includes("cost") || key.includes("promo");
      
      // Only include entitlements that should be shown in summary view
      const shouldShowInSummary = e.displayType === "BOTH";
      
      return !isPriceOrPromo && e.description && shouldShowInSummary;
    })
    .sort((a, b) => a.order - b.order)
    .map((entitlement) => {
      let value = "";
      
      switch (entitlement.valueType) {
        case "INT":
          if (entitlement.valueInt !== null && entitlement.valueInt !== undefined) {
            value = entitlement.unit
              ? `${entitlement.valueInt} ${entitlement.unit}`
              : entitlement.valueInt === -1 || entitlement.valueInt === 999999
                ? "Unlimited"
                : `Up to ${entitlement.valueInt}`;
          }
          break;
        case "BOOL":
          value = entitlement.valueBool ? "Yes" : "No";
          break;
        case "TEXT":
          value = entitlement.valueText || "";
          break;
        default:
          value = entitlement.description || entitlement.key;
      }

      return {
        label: entitlement.description || entitlement.key,
        value,
        highlighted: code === "GOLD" && entitlement.order <= 2,
        key: entitlement.key,
        displayType: entitlement.displayType,
      };
    });

  // Store all entitlements for comparison modal (filtered by displayType === 'BOTH')
  const allEntitlements = apiPlan.entitlements
    .filter((e) => {
      const key = e.key.toLowerCase();
      return !key.includes("price") && !key.includes("cost") && !key.includes("promo");
    })
    .sort((a, b) => a.order - b.order);

  return {
    id: apiPlan.id,
    code: apiPlan.code,
    name: apiPlan.name,
    price,
    period,
    description: apiPlan.description || "",
    popular: styles.popular,
    highlight: promoText || styles.highlight, // Use API promoText if available, fallback to style default
    icon: styles.icon,
    accentColor: styles.accentColor,
    gradientFrom: styles.gradientFrom,
    gradientTo: styles.gradientTo,
    features,
    allEntitlements, // Store all entitlements for comparison modal
  };
}
