import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
	accessToken: process.env.POLAR_ACCESS_TOKEN,
	successUrl: process.env.CHECKOUT_SUCCESS_URL,
	server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});
