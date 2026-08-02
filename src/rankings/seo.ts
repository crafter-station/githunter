import type { LensId } from "./types";

export const siteUrl = "https://www.githunter.dev";

const lensSeo: Record<
	LensId,
	{
		title: string;
		heading: string;
		description: string;
	}
> = {
	balanced: {
		title: "Top GitHub Developers in Peru | GitHunter",
		heading: "Top GitHub developers in Peru",
		description:
			"Discover the top GitHub developers in Peru, ranked by public commits, contributions, merged pull requests, stars, forks, reviews, and followers. Updated daily.",
	},
	builder: {
		title: "Top GitHub Builders in Peru | GitHunter",
		heading: "Top GitHub builders in Peru",
		description:
			"Explore Peru's most consistent GitHub builders ranked by commits, contributions, merged pull requests, external repositories, and reviews. Refreshed regularly.",
	},
	"oss-impact": {
		title: "Top Open Source Developers in Peru | GitHunter",
		heading: "Top open source developers in Peru",
		description:
			"See the Peruvian open source developers with the strongest public impact, ranked transparently by GitHub stars, forks, and followers across GitHub.",
	},
	maintainer: {
		title: "Top GitHub Maintainers in Peru | GitHunter",
		heading: "Top GitHub maintainers in Peru",
		description:
			"Find Peru's leading GitHub maintainers, ranked by merged pull requests, reviews, issues, external repositories, and public collaboration on public projects.",
	},
	rising: {
		title: "Fastest-Rising GitHub Developers in Peru | GitHunter",
		heading: "Fastest-rising GitHub developers in Peru",
		description:
			"See which GitHub developers in Peru are growing fastest, based on year-over-year changes in public commits, contributions, pull requests, and reviews.",
	},
};

export function getRankingSeo(lens: LensId) {
	return lensSeo[lens];
}

export function getRankingCanonical(scope: string, lens: LensId) {
	return scope === "peru" && lens === "balanced"
		? "/peru"
		: `/rankings/${scope}/${lens}`;
}
