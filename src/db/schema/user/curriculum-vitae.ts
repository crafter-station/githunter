import { z } from "zod";

export const CurriculumVitaeSchema = z.object({
	fullName: z.string(),
	email: z.string(),
	phone: z.string().optional(),
	location: z.string().optional(),
	linkedin: z.string().optional(),
	github: z.string().optional(),
	portfolio: z.string().optional(),

	summary: z.string().optional(),

	experience: z.array(
		z.object({
			title: z.string(),
			company: z.string(),
			location: z.string().optional(),
			startDate: z.string(), // ISO 8601 o "MMM YYYY"
			endDate: z.string().optional(), // "Present" o "MMM YYYY"
			descriptions: z.array(z.string()).optional(), // ej. as a list of bullet points
			keywords: z.array(z.string()).optional(), // ej. ['React', 'TypeScript']
		}),
	),

	education: z.array(
		z.object({
			degree: z.string(),
			institution: z.string(),
			location: z.string().optional(),
			graduationYear: z.string().length(4),
		}),
	),

	skills: z.array(z.string()),

	certifications: z
		.array(
			z.object({
				name: z.string(),
				year: z.string().length(4),
			}),
		)
		.optional(),

	projects: z
		.array(
			z.object({
				name: z.string(),
				description: z.string(),
				techStack: z.array(z.string()).optional(),
				link: z.string().url().optional(),
			}),
		)
		.optional(),
});

export type CurriculumVitae = z.infer<typeof CurriculumVitaeSchema>;
