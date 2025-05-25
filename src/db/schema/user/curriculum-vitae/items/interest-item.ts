import { z } from "zod";

export const PersistentInterestItemSchema = z.object({
	id: z.string(),

	content: z.string(),
});

export const AIGeneratedInterestItemSchema = z.string();

export type PersistentInterestItem = z.infer<
	typeof PersistentInterestItemSchema
>;
export type AIGeneratedInterestItem = z.infer<
	typeof AIGeneratedInterestItemSchema
>;
