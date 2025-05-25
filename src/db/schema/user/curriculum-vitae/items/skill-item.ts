import { z } from "zod";

export const PersistentSkillItemSchema = z.object({
	id: z.string(),

	content: z.string(),
});

export const AIGeneratedSkillItemSchema = z.string();

export type PersistentSkillItem = z.infer<typeof PersistentSkillItemSchema>;
export type AIGeneratedSkillItem = z.infer<typeof AIGeneratedSkillItemSchema>;
