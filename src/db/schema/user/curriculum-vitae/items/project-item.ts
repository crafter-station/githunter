import { z } from "zod";

export const BaseProjectItemSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	link: z.string().optional(),
	dateRangeFrom: z.string().optional(), // "April 2020" or "2020"
	dateRangeTo: z.string().optional(), // "May 2024" or "2024"
});

export const PersistentProjectItemSchema = BaseProjectItemSchema.extend({
	id: z.string(),

	bullets: z
		.array(
			z.object({
				id: z.string(),

				content: z.string(),
			}),
		)
		.optional(),
	techStack: z
		.array(
			z.object({
				id: z.string(),

				content: z.string(),
			}),
		)
		.optional(),
});

export const AIGeneratedProjectItemSchema = BaseProjectItemSchema.extend({
	bullets: z.array(z.string()).optional(),
	techStack: z.array(z.string()).optional(),
});
