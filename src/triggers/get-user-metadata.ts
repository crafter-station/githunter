import { type Repo, repoSchema } from "@/db/schema";
import { openai } from "@ai-sdk/openai";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { z } from "zod";

export const getUserMetadata = schemaTask({
	id: "get-user-metadata",
	schema: z.object({ username: z.string(), repos: repoSchema.array() }),
	run: async ({ username, repos }) => {
		const response = await generateObject({
			model: openai("gpt-4o-mini"),
			prompt: `
			You are a helpful assistant that is given a list of repositories and a user's username.
			You need to generate a list of potential roles for the user based on the repositories. 
      The roles should be common roles in the tech industry.
      Examples of roles:
      - Software Engineer
      - Full Stack Developer
      - Frontend Developer
      - Backend Developer
      - DevOps Engineer
      - Data Engineer
      - Cloud Engineer
      - Security Engineer
      - AI Engineer
      - Machine Learning Engineer
      - DevOps Engineer
      - DevOps Engineer

      These are some examples of roles, you may decide to use some of them or create your own.
      Provide 4-6 roles.
      
      Also, you need to generate a short description of the user based on the repositories.

      Here is the user's username:
      ${username}

			Here is the list of repositories:
			${formatRepos(repos)}
			`,
			schema: z.object({
				roles: z.array(z.string()),
				about: z.string(),
			}),
		});

		if (!response.object) {
			throw new Error("Failed to get user metadata");
		}

		return response.object;
	},
});

function formatRepos(repos: Repo[]) {
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
