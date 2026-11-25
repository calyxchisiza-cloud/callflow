export type BillingCycle = "monthly" | "annual";

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  annualMonthly: number;
  features: string[];
  highlighted?: boolean;
};

// Draft pricing — confirm before launch.
export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For a small team getting organised.",
    monthly: 29,
    annualMonthly: 23,
    features: [
      "Up to 5 agents",
      "1,000 call minutes / month",
      "Contacts & call history",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For teams running a busy call floor.",
    monthly: 59,
    annualMonthly: 47,
    highlighted: true,
    features: [
      "Up to 25 agents",
      "5,000 call minutes / month",
      "Queues, IVR & recordings",
      "Priority support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For multi-team operations.",
    monthly: 119,
    annualMonthly: 95,
    features: [
      "Unlimited agents",
      "20,000 call minutes / month",
      "QA, reporting & API access",
      "Dedicated support",
    ],
  },
];

export const trialDays = 14;

export function planById(id: string | undefined): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function priceFor(plan: Plan, cycle: BillingCycle): number {
  return cycle === "annual" ? plan.annualMonthly : plan.monthly;
}
