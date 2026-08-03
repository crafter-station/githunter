import { type RankingScope, getRankingScope } from "./data";
import type { LensId } from "./types";

export const siteUrl = "https://www.githunter.dev";

export function getRankingSeo(lens: LensId, scope: RankingScope = "peru") {
	const { name, adjective } = getRankingScope(scope);
	const content = {
		balanced: {
			title: `${name} GitHub Rankings and Seasonal Standings | GitHunter`,
			heading: `${name} GitHub Rankings`,
			description: `Find your position in ${name}'s transparent current, form, and all-time GitHub rankings across public work and open source impact.`,
		},
		builder: {
			title: `Top GitHub Builders in ${name} | GitHunter`,
			heading: `Top GitHub builders in ${name}`,
			description: `Explore ${name}'s most consistent GitHub builders ranked by commits, contributions, merged pull requests, external repositories, and reviews.`,
		},
		"oss-impact": {
			title: `Top Open Source Developers in ${name} | GitHunter`,
			heading: `Top open source developers in ${name}`,
			description: `See the ${adjective.toLowerCase()} open source developers with the strongest public impact, ranked transparently by GitHub stars, forks, and followers.`,
		},
		maintainer: {
			title: `Top GitHub Maintainers in ${name} | GitHunter`,
			heading: `Top GitHub maintainers in ${name}`,
			description: `Find ${name}'s leading GitHub maintainers, ranked by merged pull requests, reviews, issues, external repositories, and public collaboration.`,
		},
		rising: {
			title: `Fastest-Rising GitHub Developers in ${name} | GitHunter`,
			heading: `Fastest-rising GitHub developers in ${name}`,
			description: `See which GitHub developers in ${name} are growing fastest this quarter compared with the preceding quarter.`,
		},
	} satisfies Record<
		LensId,
		{ title: string; heading: string; description: string }
	>;
	return content[lens];
}

export function getRankingCanonical(scope: string, lens: LensId) {
	return lens === "balanced" ? `/${scope}` : `/${scope}?lens=${lens}`;
}
