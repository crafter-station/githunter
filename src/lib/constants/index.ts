import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export const SEARCH_RESULTS_PER_PAGE = 20;

export const PRICING_PLANS = [
	{
		id: "free",
		name: "Free",
		description: "Get started with basic search options",
		price: 0,
		popular: false,
		buttonText: "Get Started",
		buttonVariant: "default" as ButtonVariant,
		features: ["Unlimited developer searches"],
	},
	{
		id: process.env.NEXT_PUBLIC_POLAR_PRO_PLAN_PRODUCT_ID || "2",
		name: "Pro",
		description: "For recruiters",
		price: 5,
		popular: true,
		buttonText: "Subscribe",
		buttonVariant: "default" as ButtonVariant,
		features: ["Advanced search filters", "Voice summaries"],
	},
	{
		id: process.env.NEXT_PUBLIC_POLAR_PLUS_PLAN_PRODUCT_ID || "3",
		name: "Plus",
		description: "For teams hiring at scale",
		price: 10,
		popular: false,
		buttonText: "Subscribe",
		buttonVariant: "outline" as ButtonVariant,
		features: [
			"Everything in Pro tier",
			"Index new users",
			"Re-index existing users",
		],
	},
] as const;
