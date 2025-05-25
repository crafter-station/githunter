import { processCurriculumVitaeTask } from "@/triggers/process-curriculum-vitae-task";

await processCurriculumVitaeTask.trigger({
	clerkUserId: "user_2mJ3qzQZ0000000000000000",
	fileUrl: "https://www.google.com",
});
