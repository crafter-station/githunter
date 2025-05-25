import { processCurriculumVitaeTask } from "@/triggers/process-curriculum-vitae-task";
import { currentUser } from "@clerk/nextjs/server";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	documentUploader: f({
		pdf: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: "8MB",
			maxFileCount: 1,
		},
		"application/msword": {
			maxFileSize: "8MB",
			maxFileCount: 1,
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
			maxFileSize: "8MB",
			maxFileCount: 1,
		},
	})
		// Set permissions and file types for this FileRoute
		.middleware(async () => {
			// This code runs on your server before upload
			const user = await currentUser();

			// If you throw, the user will not be able to upload
			if (!user) throw new UploadThingError("Unauthorized");

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.userId);

			console.log("file url", file.ufsUrl);

			await processCurriculumVitaeTask.trigger({
				clerkUserId: metadata.userId,
				fileUrl: file.ufsUrl,
			});

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
