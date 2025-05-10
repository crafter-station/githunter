export type SearchParams = {
	role: string;
	alternativeNamesForRole: string[];
	primaryTechStack: string[];
	secondaryTechStack: string[];
	country: string | null;
	city: string | null;
	minStars: number | null;
	minRepos: number | null;
};
