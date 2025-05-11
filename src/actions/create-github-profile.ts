"use server";

import { getSubscription } from "@/lib/get-suscription";
import { tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";

const formSchema = z.object({
	username: z.string().min(1, "Username is required"),
});

export async function createGithubProfileAction(
	prevState: { error: string | null },
	formData: FormData,
) {
	const currentPlan = await getSubscription();

	if (!currentPlan) {
		return { error: "Unauthorized" };
	}

	if (currentPlan?.name !== "Plus") {
		return { error: "Unauthorized" };
	}

	// Validate form data
	const username = formData.get("username");

	const validatedFields = formSchema.safeParse({
		username,
	});

	if (!validatedFields.success) {
		return { error: "Invalid username" };
	}

	try {
		// Trigger the GitHub profile population task
		const handle = await tasks.trigger(
			"pupulate-github-user",
			{
				username: validatedFields.data.username,
			},
			{
				tags: [`user:${validatedFields.data.username}`],
			},
		);

		// Prepare the search parameters and redirect URL
		const searchParams = new URLSearchParams();
		searchParams.set("runId", handle.id);
		searchParams.set("token", handle.publicAccessToken);

		// Return success data that will be used if redirect doesn't happen
		return {
			error: null,
			success: true,
			redirectUrl: `/new/${validatedFields.data.username}?${searchParams.toString()}`,
		};
	} catch (error) {
		console.error("Failed to trigger task:", error);
		return { error: "Failed to process GitHub profile" };
	}
}
