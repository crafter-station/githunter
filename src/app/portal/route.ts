import { currentUser } from "@clerk/nextjs/server";
import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
	accessToken: process.env.POLAR_ACCESS_TOKEN || "",
	getCustomerId: async () => {
		const user = await currentUser();
		if (!user) {
			throw new Error("Unauthorized");
		}

		return user.privateMetadata.polarCustomerId as string;
	}, // Fuction to resolve a Polar Customer ID
	server: process.env.NODE_ENV === "production" ? "production" : "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});
