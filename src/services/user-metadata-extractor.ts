import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import type { RecentRepo, UserSelect } from "@/db";
import { ROLES } from "@/lib/constants";
export class UserMetadataExtractor {
	public async extract(
		username: string,
		repos: RecentRepo[],
	): Promise<
		Pick<UserSelect, "stack" | "about"> & {
			roles: UserSelect["potentialRoles"];
		}
	> {
		const response = await generateObject({
			model: openai("gpt-4o-mini"),
			prompt: `Given the following repos, determine the role and stack of the user:
    ${this.formatRepos(repos)}
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
			schema: z.object({
				role: z.string(),
				alternativeNamesForRole: z.array(z.string()),
				stack: z.array(z.string()),
				about: z.string(),
			}),
		});

		if (!response.object) {
			throw new Error("Failed to get user metadata");
		}

		return {
			roles: [
				response.object.role.trim().toLowerCase(),
				...response.object.alternativeNamesForRole.map((role) =>
					role.trim().toLowerCase(),
				),
				"software engineer",
				"programmer",
				"developer",
			],
			about: response.object.about,
			stack: response.object.stack.map((tech) => tech.trim().toLowerCase()),
		};
	}

	formatRepos(repos: RecentRepo[]) {
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
}
