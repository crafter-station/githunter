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
		features: ["20 searches per day"],
	},
	{
		id: process.env.NEXT_PUBLIC_POLAR_PRO_PLAN_PRODUCT_ID || "",
		name: "Pro",
		description: "For recruiters",
		price: 5,
		popular: true,
		buttonText: "Subscribe",
		buttonVariant: "default" as ButtonVariant,
		features: [
			"Unlimited searches",
			"Advanced search filters",
			"Voice summaries",
		],
	},
	{
		id: process.env.NEXT_PUBLIC_POLAR_PLUS_PLAN_PRODUCT_ID || "",
		name: "Plus",
		description: "For companies hiring at scale",
		price: 20,
		popular: false,
		buttonText: "Subscribe",
		buttonVariant: "outline" as ButtonVariant,
		features: ["Everything in Pro tier", "Index new users"],
	},
] as const;
