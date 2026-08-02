import type { RankingDataset, RankingMetrics, RankingProfile } from "./types";

interface ContributionCollection {
	contributionCalendar: { totalContributions: number };
	restrictedContributionsCount: number;
	totalCommitContributions: number;
	totalIssueContributions: number;
	totalPullRequestContributions: number;
	totalPullRequestReviewContributions: number;
}

interface GithubUser {
	login: string;
	name: string | null;
	location: string | null;
	avatarUrl: string;
	followers: { totalCount: number };
	repositories: {
		nodes: Array<{ stargazerCount: number; forkCount: number }>;
	};
	repositoriesContributedTo: { totalCount: number };
	current: ContributionCollection;
	previous: ContributionCollection;
}

interface GithubBatchResponse {
	data?: Record<string, unknown>;
	errors?: Array<{ message: string }>;
}

export interface CollectionProgress {
	completed: number;
	total: number;
}

function isoDate(date: Date) {
	return date.toISOString();
}

function utcStartOfDay(date: Date) {
	return new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
	);
}

function daysBefore(date: Date, days: number) {
	return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}

function wait(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function createEvidenceWindows(now: Date) {
	const currentDay = utcStartOfDay(now);
	return {
		generatedAt: isoDate(now),
		period: {
			from: isoDate(daysBefore(currentDay, 364)),
			to: isoDate(new Date(daysBefore(currentDay, -1).getTime() - 1)),
		},
		previousPeriod: {
			from: isoDate(daysBefore(currentDay, 729)),
			to: isoDate(new Date(daysBefore(currentDay, 364).getTime() - 1)),
		},
	};
}

export function createSeasonEvidenceWindows(now: Date) {
	const currentDay = utcStartOfDay(now);
	const quarterMonth = Math.floor(currentDay.getUTCMonth() / 3) * 3;
	const currentFrom = new Date(
		Date.UTC(currentDay.getUTCFullYear(), quarterMonth, 1),
	);
	const currentTo = new Date(daysBefore(currentDay, -1).getTime() - 1);
	const previousFrom = new Date(
		Date.UTC(currentDay.getUTCFullYear(), quarterMonth - 3, 1),
	);
	const elapsed = currentTo.getTime() - currentFrom.getTime();
	const previousTo = new Date(previousFrom.getTime() + elapsed);
	return {
		generatedAt: isoDate(now),
		period: { from: isoDate(currentFrom), to: isoDate(currentTo) },
		previousPeriod: { from: isoDate(previousFrom), to: isoDate(previousTo) },
	};
}

function publicContributions(collection: ContributionCollection) {
	return Math.max(
		0,
		collection.contributionCalendar.totalContributions -
			collection.restrictedContributionsCount,
	);
}

function activityMetrics(
	collection: ContributionCollection,
	mergedPullRequests: number,
): Partial<RankingMetrics> {
	return {
		commits: collection.totalCommitContributions,
		publicContributions: publicContributions(collection),
		mergedPullRequests,
		pullRequests: collection.totalPullRequestContributions,
		reviews: collection.totalPullRequestReviewContributions,
		issues: collection.totalIssueContributions,
	};
}

function currentMetrics(
	user: GithubUser,
	mergedPullRequests: number,
): RankingMetrics {
	return {
		...activityMetrics(user.current, mergedPullRequests),
		stars: user.repositories.nodes.reduce(
			(sum, repository) => sum + repository.stargazerCount,
			0,
		),
		forks: user.repositories.nodes.reduce(
			(sum, repository) => sum + repository.forkCount,
			0,
		),
		followers: user.followers.totalCount,
		externalRepos: user.repositoriesContributedTo.totalCount,
	} as RankingMetrics;
}

export function readBatchProfiles(
	response: GithubBatchResponse,
	batch: string[],
) {
	if (response.errors?.length && !response.data) {
		throw new Error(response.errors.map((error) => error.message).join("; "));
	}
	if (!response.data) throw new Error("GitHub returned no ranking data");
	const profiles: RankingProfile[] = [];

	for (let index = 0; index < batch.length; index += 1) {
		const user = response.data[`u${index}`] as GithubUser | null;
		if (!user) continue;
		const currentMerged = response.data[`m${index}`] as
			| { issueCount: number }
			| null
			| undefined;
		const previousMerged = response.data[`pm${index}`] as
			| { issueCount: number }
			| null
			| undefined;
		if (!currentMerged || !previousMerged) continue;
		profiles.push({
			login: user.login,
			name: user.name ?? "",
			location: user.location ?? "",
			avatarUrl: user.avatarUrl,
			metrics: currentMetrics(user, currentMerged.issueCount),
			previousMetrics: activityMetrics(
				user.previous,
				previousMerged.issueCount,
			),
		});
	}

	return profiles;
}

function safeLogin(login: string) {
	return login.replaceAll("\\", "").replaceAll('"', "");
}

function createBatchQuery(
	logins: string[],
	currentFrom: string,
	currentTo: string,
	previousFrom: string,
	previousTo: string,
) {
	const fields = logins
		.map((unsafeLogin, index) => {
			const login = safeLogin(unsafeLogin);
			const currentRange = `${currentFrom.slice(0, 10)}..${currentTo.slice(0, 10)}`;
			const previousRange = `${previousFrom.slice(0, 10)}..${previousTo.slice(0, 10)}`;
			return `
			u${index}: user(login: "${login}") {
				login name location avatarUrl
				followers { totalCount }
				repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
					nodes { stargazerCount forkCount }
				}
				repositoriesContributedTo(first: 1, includeUserRepositories: false, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, PULL_REQUEST_REVIEW]) { totalCount }
				current: contributionsCollection(from: "${currentFrom}", to: "${currentTo}") {
					contributionCalendar { totalContributions }
					restrictedContributionsCount totalCommitContributions totalIssueContributions totalPullRequestContributions totalPullRequestReviewContributions
				}
				previous: contributionsCollection(from: "${previousFrom}", to: "${previousTo}") {
					contributionCalendar { totalContributions }
					restrictedContributionsCount totalCommitContributions totalIssueContributions totalPullRequestContributions totalPullRequestReviewContributions
				}
			}
			m${index}: search(query: "author:${login} is:pr is:merged is:public merged:${currentRange}", type: ISSUE, first: 1) { issueCount }
			pm${index}: search(query: "author:${login} is:pr is:merged is:public merged:${previousRange}", type: ISSUE, first: 1) { issueCount }
		`;
		})
		.join("\n");
	return `query { ${fields} rateLimit { cost remaining resetAt } }`;
}

async function fetchBatch(
	token: string,
	query: string,
): Promise<GithubBatchResponse> {
	let lastError: unknown;
	for (let attempt = 0; attempt < 3; attempt += 1) {
		try {
			const response = await fetch("https://api.github.com/graphql", {
				method: "POST",
				headers: {
					Accept: "application/vnd.github+json",
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					"User-Agent": "githunter-ranking-refresh",
				},
				body: JSON.stringify({ query }),
				signal: AbortSignal.timeout(30_000),
			});
			if (!response.ok) {
				throw new Error(
					`GitHub GraphQL request failed with ${response.status}`,
				);
			}
			return (await response.json()) as GithubBatchResponse;
		} catch (error) {
			lastError = error;
			if (attempt < 2) await wait(1000 * 2 ** attempt);
		}
	}
	throw lastError instanceof Error
		? lastError
		: new Error("GitHub GraphQL request failed");
}

export async function collectRankingDataset({
	scope,
	logins,
	token,
	cohortDefinition,
	onProgress,
	now = new Date(),
}: {
	scope: string;
	logins: string[];
	token: string;
	cohortDefinition: string;
	onProgress?: (progress: CollectionProgress) => void;
	now?: Date;
}): Promise<RankingDataset> {
	const { generatedAt, period, previousPeriod } =
		createSeasonEvidenceWindows(now);
	const currentFrom = period.from;
	const currentTo = period.to;
	const previousFrom = previousPeriod.from;
	const previousTo = previousPeriod.to;
	const profiles: RankingProfile[] = [];
	const batchSize = 3;

	for (let offset = 0; offset < logins.length; offset += batchSize) {
		const batch = logins.slice(offset, offset + batchSize);
		const query = createBatchQuery(
			batch,
			currentFrom,
			currentTo,
			previousFrom,
			previousTo,
		);
		const response = await fetchBatch(token, query);
		profiles.push(...readBatchProfiles(response, batch));

		onProgress?.({
			completed: Math.min(offset + batch.length, logins.length),
			total: logins.length,
		});
	}

	return {
		scope,
		generatedAt,
		period,
		previousPeriod,
		cohort: {
			definition: cohortDefinition,
			candidates: logins.length,
			scored: profiles.length,
		},
		sources: ["GitHub GraphQL API", "GitHub Search API", "committers.top Peru"],
		limitations: [
			"GitHub location is self-reported.",
			"Stars, forks, followers, and external repositories are cumulative.",
			"Activity and collaboration reset at the start of each calendar quarter.",
			"Rising compares quarter-to-date activity with the same elapsed window in the preceding quarter.",
			"Stars and forks cover the 100 most-starred public, non-fork repositories owned by each user.",
			"Private activity and contribution size are excluded for comparability.",
		],
		profiles,
	};
}
