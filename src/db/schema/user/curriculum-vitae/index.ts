import z from "zod";
import {
	AIGeneratedCertificationItemSchema,
	PersistentCertificationItemSchema,
} from "./items/certification-item";
import {
	AIGeneratedEducationItemSchema,
	PersistentEducationItemSchema,
} from "./items/education-item";
import {
	AIGeneratedExperienceItemSchema,
	PersistentExperienceItemSchema,
} from "./items/experience-item";
import {
	AIGeneratedInterestItemSchema,
	PersistentInterestItemSchema,
} from "./items/interest-item";
import {
	AIGeneratedProjectItemSchema,
	PersistentProjectItemSchema,
} from "./items/project-item";
import {
	AIGeneratedSkillItemSchema,
	PersistentSkillItemSchema,
} from "./items/skill-item";

const BaseCurriculumVitaeSchema = z.object({
	fullName: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	location: z.string().optional(),
	linkedInHandle: z.string().optional(),
	githubHandle: z.string().optional(),
	websiteUrl: z.string().optional(),
	summary: z.string().optional(),
});

export const AIGeneratedCurriculumVitaeSchema =
	BaseCurriculumVitaeSchema.extend({
		experience: z.array(AIGeneratedExperienceItemSchema).optional(),
		education: z.array(AIGeneratedEducationItemSchema).optional(),
		certifications: z.array(AIGeneratedCertificationItemSchema).optional(),
		projects: z.array(AIGeneratedProjectItemSchema).optional(),
		skills: z.array(AIGeneratedSkillItemSchema).optional(),
		interests: z.array(AIGeneratedInterestItemSchema).optional(),
	});

export const PersistentCurriculumVitaeSchema = BaseCurriculumVitaeSchema.extend(
	{
		experience: z.array(PersistentExperienceItemSchema).optional(),
		education: z.array(PersistentEducationItemSchema).optional(),
		certifications: z.array(PersistentCertificationItemSchema).optional(),
		projects: z.array(PersistentProjectItemSchema).optional(),
		skills: z.array(PersistentSkillItemSchema).optional(),
		interests: z.array(PersistentInterestItemSchema).optional(),
	},
);

export type AIGeneratedCurriculumVitae = z.infer<
	typeof AIGeneratedCurriculumVitaeSchema
>;

export type PersistentCurriculumVitae = z.infer<
	typeof PersistentCurriculumVitaeSchema
>;
