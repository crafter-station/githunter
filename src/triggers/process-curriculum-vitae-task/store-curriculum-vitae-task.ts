import {
	AIGeneratedCurriculumVitaeSchema,
	type PersistentCurriculumVitae,
	db,
	user as userTable,
} from "@/db";
import { nanoid } from "@/lib/nanoid";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const storeCurriculumVitaeTask = schemaTask({
	id: "store-curriculum-vitae",
	schema: z.object({
		clerkUserId: z.string(),
		aiGeneratedCurriculumVitae: AIGeneratedCurriculumVitaeSchema,
	}),
	run: async ({ clerkUserId, aiGeneratedCurriculumVitae }) => {
		await db
			.update(userTable)
			.set({
				curriculumVitae: {
					...aiGeneratedCurriculumVitae,
					experience: aiGeneratedCurriculumVitae.experience?.map(
						(experience) => ({
							...experience,
							id: nanoid(),
							bullets: experience.bullets?.map((bullet) => ({
								id: nanoid(),
								content: bullet,
							})),
							techStack: experience.techStack?.map((techStack) => ({
								id: nanoid(),
								content: techStack,
							})),
						}),
					),
					education: aiGeneratedCurriculumVitae.education?.map((education) => ({
						...education,
						id: nanoid(),
					})),
					certifications: aiGeneratedCurriculumVitae.certifications?.map(
						(certification) => ({
							...certification,
							id: nanoid(),
						}),
					),
					projects: aiGeneratedCurriculumVitae.projects?.map((project) => ({
						...project,
						id: nanoid(),
						techStack: project.techStack?.map((techStack) => ({
							id: nanoid(),
							content: techStack,
						})),
						bullets: project.bullets?.map((bullet) => ({
							id: nanoid(),
							content: bullet,
						})),
					})),
					skills: aiGeneratedCurriculumVitae.skills?.map((skill) => ({
						id: nanoid(),
						content: skill,
					})),
					interests: aiGeneratedCurriculumVitae.interests?.map((interest) => ({
						id: nanoid(),
						content: interest,
					})),
				} satisfies PersistentCurriculumVitae,
				updatedAt: new Date(),
			})
			.where(eq(userTable.clerkId, clerkUserId));
	},
});
