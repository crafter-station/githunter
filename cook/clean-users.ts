import fs from "node:fs/promises";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { ROLES } from "@/lib/constants/roles";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { eq, not } from "drizzle-orm";
import { z } from "zod";

const users = await db.query.user.findMany({
	where: (user) => not(eq(user.repos, [])),
});

await Promise.all(
	users.map(async (user) => {
		try {
			const response = await generateObject({
				model: openai("gpt-4o-mini"),
				schema: z.object({
					role: z.string(),
					alternativeNamesForRole: z.array(z.string()),
					stack: z.array(z.string()),
					about: z.string(),
				}),
				prompt: `Given the following repos, determine the role and stack of the user:
    ${formatRepos(user.repos)}
    The role should be a single role that the user is most likely to be.
    Avoid the generic role "software engineer".
    The stack should be a list of technologies that the user is most likely to be using.
    The repos with more contributions to the repo should be given more weight.
    Use the one of the following roles:
    ${ROLES.join(", ")}  
    The about should be a short description of the user. Avoid generalities. Make it short like a tweet size message.
    Avoid word like "versatile" or "polyglot". Just describe their skills and expertise.
    Dont include the name of the user in the about. Just start with the role and stack.
    `,
			});

			await db
				.update(userTable)
				.set({
					potentialRoles: [
						response.object.role.toLowerCase(),
						...response.object.alternativeNamesForRole.map((role) =>
							role.toLowerCase(),
						),
					],
					stack: response.object.stack.map((tech) => tech.toLowerCase()),
					about: response.object.about,
				})
				.where(eq(userTable.id, user.id));
		} catch (error) {
			await fs.appendFile("errors.txt", `${user.id}\n`);
		}
	}),
);

function formatRepos(
	repos: {
		fullName: string;
		description: string;
		techStack: string[];
		stars: number;
	}[],
) {
	return repos
		.map(
			(repo) => `### ${repo.fullName}
        Description: ${repo.description}
        Tech Stack: ${repo.techStack.join(", ")}
        Stars: ${repo.stars}
        `,
		)
		.join("\n\n");
}
