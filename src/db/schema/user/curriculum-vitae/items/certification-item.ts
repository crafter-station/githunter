import { z } from "zod";

export const BaseCertificationItemSchema = z.object({
	name: z.string(),
	dateGranted: z.string().optional(), // "April 2020" or "2020"
	link: z.string().optional(),
});

export const PersistentCertificationItemSchema =
	BaseCertificationItemSchema.extend({
		id: z.string(),
	});

export const AIGeneratedCertificationItemSchema = BaseCertificationItemSchema;
