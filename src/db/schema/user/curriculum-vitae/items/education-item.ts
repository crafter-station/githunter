import { z } from "zod";

export const BaseEducationItemSchema = z.object({
	degree: z.string(),
	institution: z.string(),
	location: z.string().optional(),
	dateRangeFrom: z.string().optional(), // "April 2020" or "2020"
	dateRangeTo: z.string().optional(), // "May 2024" or "2024"
});

export const PersistentEducationItemSchema = BaseEducationItemSchema.extend({
	id: z.string(),
});

export const AIGeneratedEducationItemSchema = BaseEducationItemSchema;
