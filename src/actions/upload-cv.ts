"use server";

import { auth } from "@clerk/nextjs/server";
import { tasks } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { getSubscription } from "@/lib/get-suscription";
import type { processCurriculumVitaeTask } from "@/triggers/process-curriculum-vitae-task";

const formSchema = z.object({
	fileUrl: z.string().min(1, "File URL is required"),
});

export async function uploadCVAction(
	prevState: { error: string | null },
	formData: FormData,
) {
	const currentPlan = await getSubscription();
	const session = await auth();

	if (!currentPlan) {
		return { error: "Unauthorized" };
	}

	if (currentPlan?.name !== "Plus") {
		return { error: "Unauthorized" };
	}

	if (!session.userId) {
		return { error: "Unauthorized" };
	}

	// Validate form data
	const fileUrl = formData.get("fileUrl");

	const validatedFields = formSchema.safeParse({
		fileUrl,
	});

	if (!validatedFields.success) {
		return { error: "Invalid file URL" };
	}

	try {
		// Trigger the CV processing task
		const handle = await tasks.trigger<typeof processCurriculumVitaeTask>(
			"process-curriculum-vitae",
			{
				fileUrl: validatedFields.data.fileUrl,
				clerkUserId: session.userId,
			},
			{
				tags: [`cv:${validatedFields.data.fileUrl}`],
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
			redirectUrl: `/cv/uploading?${searchParams.toString()}`,
		};
	} catch (error) {
		console.error("Failed to trigger task:", error);
		return { error: "Failed to process CV" };
	}
}
