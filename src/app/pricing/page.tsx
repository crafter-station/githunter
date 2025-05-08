import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

const pricingPlans = [
	{
		id: "free",
		name: "Free",
		description: "Get started with basic search options",
		price: 0,
		popular: false,
		buttonText: "Get Started",
		buttonVariant: "default" as ButtonVariant,
		features: [
			"10 searches per day",
			"Basic developer profiles",
			"GitHub repository information",
		],
	},
	{
		id: "pro",
		name: "Pro",
		description: "Perfect for recruiters and small teams",
		price: 29,
		popular: true,
		buttonText: "Subscribe Now",
		buttonVariant: "default" as ButtonVariant,
		features: [
			"Unlimited searches",
			"Advanced search filters",
			"Smart alerts for new matches",
			"Voice summaries (10/month)",
		],
	},
	{
		id: "enterprise",
		name: "Enterprise",
		description: "For companies hiring at scale",
		price: 99,
		popular: false,
		buttonText: "Contact Sales",
		buttonVariant: "outline" as ButtonVariant,
		features: [
			"Everything in Pro tier",
			"Team collaboration tools",
			"API access",
			"Dedicated support",
		],
	},
];

export default function PricingPage() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			{/* Header */}
			<Header />

			{/* Pricing Section */}
			<section className="flex min-h-[80dvh] items-center justify-center border-border border-t border-dashed py-20">
				<div className="container mx-auto px-4">
					<h2 className="mb-6 text-center font-medium text-2xl">
						Choose Your Perfect Plan
					</h2>
					<p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
						Find the right plan for your developer search needs, from
						individuals to enterprises
					</p>

					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
						{pricingPlans.map((plan) => (
							<Card
								key={plan.id}
								className={`border-border ${
									plan.popular ? "border-[#e0e26c] dark:border-[#E6E7A4]" : ""
								} relative bg-card p-6 transition-shadow hover:shadow-md`}
							>
								{plan.popular && (
									<div className="absolute top-0 right-0 rounded-tr-md rounded-bl-md bg-[#e0e26c] px-3 py-1 font-medium text-black text-xs dark:bg-[#E6E7A4]">
										Popular
									</div>
								)}
								<div className="flex flex-col gap-4">
									<h3 className="font-medium text-lg">{plan.name}</h3>
									<p className="text-muted-foreground text-sm">
										{plan.description}
									</p>
									<div className="flex items-baseline gap-1">
										<span className="font-bold text-3xl">${plan.price}</span>
										<span className="text-muted-foreground text-sm">
											/month
										</span>
									</div>
									<Button
										className={`mt-4 ${
											plan.popular
												? "bg-primary text-primary-foreground hover:bg-primary/90"
												: ""
										}`}
										variant={plan.buttonVariant}
									>
										{plan.buttonText}
									</Button>

									<div className="mt-6 space-y-3">
										{plan.features.map((feature, idx) => (
											<div
												key={`${plan.id}-feature-${idx}`}
												className="flex items-start gap-2"
											>
												<Check className="h-5 w-5 flex-shrink-0 text-[#54ada5]" />
												<p className="text-sm">{feature}</p>
											</div>
										))}
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="flex min-h-[50dvh] items-center justify-center border-border border-t border-dashed">
				<div className="container mx-auto px-4 text-center">
					<div className="mx-auto max-w-2xl">
						<h2 className="mb-4 font-medium text-2xl">
							Start Finding Real Open-Source Talent
						</h2>
						<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
							Discover developers based on their actual contributions,
							technology stack, and availability.
						</p>
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Button
								size="lg"
								className="bg-primary px-6 text-primary-foreground hover:bg-primary/90"
							>
								Try GitHunter Free
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-border px-6"
							>
								Learn More
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
}
