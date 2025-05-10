import { Polar } from "@polar-sh/sdk";
import type { ProductPriceFixed } from "@polar-sh/sdk/models/components/productpricefixed.js";

export type PlanConfig = {
	name: string;
	description: string | null;
	amount: number; // in cents
};

export type Plan = {
	productId: string;
	priceId: string;
	config: PlanConfig;
};

export type Checkout = {
	url: string;
	id: string;
};

export class PolarService {
	private polar: Polar;

	constructor() {
		let server = process.env.POLAR_SERVER as "sandbox" | "production";
		if (!(server === "sandbox" || server !== "production")) {
			server = "sandbox";
		}

		this.polar = new Polar({
			accessToken: process.env.POLAR_ACCESS_TOKEN,
			server: server,
		});
	}

	public async createPlans(plansConfig: PlanConfig[]): Promise<Plan[]> {
		const plans = [];

		for (const cfg of plansConfig) {
			const product = await this.polar.products.create({
				name: cfg.name,
				description: cfg.description ?? "",
				recurringInterval: "month",
				prices: [
					{
						priceCurrency: "usd",
						priceAmount: cfg.amount,
						amountType: "fixed",
					},
				],
			});
			plans.push({
				productId: product.id,
				priceId: product.prices[0].id,
				config: {
					name: product.name,
					description: product.description,
					amount: (product.prices[0] as ProductPriceFixed).priceAmount || 0,
				},
			});
		}

		return plans;
	}

	public async listPlans(): Promise<Plan[]> {
		const response = await this.polar.products.list({
			limit: 10,
		});

		const plans: Plan[] = [];

		for (const product of response.result.items) {
			plans.push({
				productId: product.id,
				priceId: product.prices[0].id,
				config: {
					name: product.name,
					description: product.description,
					amount: (product.prices[0] as ProductPriceFixed).priceAmount || 0,
				},
			});
		}

		return plans;
	}

	public async createCheckout(
		productId: string,
		userId: string,
	): Promise<Checkout> {
		const checkout = await this.polar.checkouts.create({
			successUrl: process.env.POLAR_SUCCESS_CHECKOUT_URL,
			products: [productId],
			metadata: {
				userId: userId,
			},
		});

		return {
			id: checkout.id,
			url: checkout.url,
		};
	}

	public async listSubs() {
		const resp = await this.polar.subscriptions.list({
			limit: 10,
		});

		return resp.result.items;
	}
}
