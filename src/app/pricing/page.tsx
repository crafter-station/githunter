"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRICING_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Check, CheckCircle, Copy } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PricingPage() {
	const { user } = useUser();
	const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

	const copyToClipboard = React.useCallback((code: string) => {
		navigator.clipboard.writeText(code);
		setCopiedCode(code);
		setTimeout(() => setCopiedCode(null), 2000);
	}, []);

	const currentPlan = React.useMemo(() => {
		if (user?.publicMetadata.subscriptionStatus === "active") {
			return (
				PRICING_PLANS.find(
					(plan) => plan.id === user?.publicMetadata.subscriptionPlanId,
				) || null
			);
		}

		return null;
	}, [user]);

	const getLink = React.useCallback(
		(plan: (typeof PRICING_PLANS)[number]) => {
			if (plan.id === "free") {
				return "/";
			}

			if (!user) {
				return "/sign-in";
			}

			if (currentPlan) {
				return "/portal";
			}

			const urlSearchParams = new URLSearchParams();
			urlSearchParams.set("products", plan.id);
			urlSearchParams.set("customerExternalId", user.id);
			urlSearchParams.set("customer_external_id", user.id);

			if (user.emailAddresses[0].emailAddress) {
				urlSearchParams.set(
					"customerEmail",
					user.emailAddresses[0].emailAddress,
				);
			}
			if (user.fullName) {
				urlSearchParams.set("customerName", user.fullName);
			}

			if (plan.discountCode) {
				urlSearchParams.set("discount_code", plan.discountCode);
			}

			return `/checkout?${urlSearchParams.toString()}`;
		},
		[user, currentPlan],
	);

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			{/* Header */}
			<Header noSearch />

			{/* Pricing Section */}
			<section className="flex min-h-[80dvh] items-center justify-center border-border border-t border-dashed py-20">
				<div className="container mx-auto px-4">
					<h2 className="mb-6 text-center font-semibold text-2xl">
						Choose Your Perfect Plan
					</h2>
					<p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
						Find the right plan for your developer search needs, from
						individuals to enterprises
					</p>

					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
						{PRICING_PLANS.map((plan) => (
							<Card
								key={plan.id}
								className={`border-border ${
									plan.popular ? "border-[#e0e26c] dark:border-[#E6E7A4]" : ""
								} relative h-full bg-card p-6 transition-shadow hover:shadow-md`}
							>
								{plan.popular && (
									<div className="absolute top-0 right-0 rounded-tr-md rounded-bl-md bg-[#e0e26c] px-3 py-1 font-medium text-black text-xs dark:bg-[#E6E7A4]">
										Popular
									</div>
								)}
								<div className="flex h-full flex-col justify-between gap-4">
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

										<div className="mt-3 mb-2 space-y-3">
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

										{plan.discountCode && (
											<div className="group mt-2">
												<button
													type="button"
													className="flex w-full items-center justify-between rounded-md border border-yellow-300 border-dashed bg-yellow-50/20 p-2 transition-all hover:shadow-sm dark:border-yellow-500 dark:bg-yellow-900/10"
													onClick={() =>
														plan.discountCode &&
														copyToClipboard(plan.discountCode)
													}
													onKeyDown={(e) => {
														if (
															(e.key === "Enter" || e.key === " ") &&
															plan.discountCode
														) {
															copyToClipboard(plan.discountCode);
														}
													}}
													aria-label={`Copy discount code ${plan.discountCode || ""}`}
												>
													<div className="flex flex-col">
														<span className="font-semibold text-xs text-yellow-700 dark:text-yellow-500">
															100% OFF First Month!
														</span>
														<span className="flex items-center gap-1 font-mono text-xs">
															{plan.discountCode}
														</span>
													</div>
													{copiedCode === plan.discountCode ? (
														<div className="flex items-center gap-1 font-medium text-green-500 text-xs">
															<CheckCircle className="h-3.5 w-3.5" />
															<span>Copied</span>
														</div>
													) : (
														<div className="flex items-center gap-1 text-muted-foreground/70 text-xs">
															<span>Click to copy</span>
															<Copy className="h-3.5 w-3.5" />
														</div>
													)}
												</button>
											</div>
										)}
									</div>

									<Link
										href={getLink(plan)}
										className={cn(
											buttonVariants({
												variant: plan.buttonVariant,
											}),
											"mt-6 w-full",
											plan.popular &&
												"bg-primary text-primary-foreground hover:bg-primary/90",
										)}
										target={
											getLink(plan).includes("portal") ? "_blank" : undefined
										}
									>
										{currentPlan?.id === plan.id
											? "Manage Subscription"
											: plan.buttonText}
									</Link>
								</div>
							</Card>
						))}
					</div>
					<div className="mx-auto mt-8 flex w-max flex-col gap-1">
						<p className="text-muted-foreground text-xs">
							* Get 1 month free with the discount codes{" "}
							{PRICING_PLANS.filter((plan) => plan.name !== "Free")
								.map((plan) => plan.discountCode)
								.join(" and ")}
							. Valid for launch week only.
						</p>
						<p className="text-muted-foreground text-xs">
							** All plans are billed monthly
						</p>
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
