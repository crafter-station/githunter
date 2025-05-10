export type SearchParams = {
	role: string;
	alternativeNamesForRole: string[];
	techStack: {
		tech: string;
		relevance: number;
	}[];
	country: string | null;
	city: string | null;
	minStars: number | null;
	minRepos: number | null;
};
