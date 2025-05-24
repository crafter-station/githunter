import type { RecentRepo } from "@/db/schema";

export function mapTechStack(repos: RecentRepo[]): Set<string> {
	const techStackSet = new Set<string>();

	for (const repo of repos) {
		for (const tech of repo.techStack) {
			techStackSet.add(tech);
		}
	}

	return techStackSet;
}
