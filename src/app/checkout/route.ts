import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
	accessToken: process.env.POLAR_ACCESS_TOKEN,
	successUrl: process.env.POLAR_SUCCESS_CHECKOUT_URL,
	server: process.env.NODE_ENV === "production" ? "production" : "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});
