import { and, asc, desc, eq, lt, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { RankingScope } from "./data";
import { buildCareerStandings, getSeason } from "./seasons";
import type {
	CareerStanding,
	LensId,
	RankingSeason,
	RankingSeasonResult,
	RankingSnapshot,
} from "./types";

function resultId(
	seasonId: string,
	scope: string,
	lensId: LensId,
	username: string,
) {
	return `${seasonId}:${scope}:${lensId}:${username.toLowerCase()}`;
}

function mapSeason(row: {
	id: string;
	label: string;
	startsAt: string;
	endsAt: string;
	status: string;
	rulesetVersion: string;
	closedAt: Date | null;
}): RankingSeason {
	return {
		id: row.id,
		label: row.label,
		startsAt: row.startsAt,
		endsAt: row.endsAt,
		status:
			row.status === "closed"
				? "closed"
				: row.status === "reconstructed"
					? "reconstructed"
					: row.status === "preseason"
						? "preseason"
						: "active",
		rulesetVersion: row.rulesetVersion,
		closedAt: row.closedAt?.toISOString() ?? null,
	};
}

export function resultsFromSnapshots(snapshots: RankingSnapshot[]) {
	if (snapshots.length === 0) return { seasons: [], results: [] };
	const season = getSeason(new Date(snapshots[0].generatedAt));
	const results = snapshots.flatMap((snapshot) =>
		snapshot.entries.map(
			(entry) =>
				({
					seasonId: season.id,
					scope: snapshot.scope,
					lensId: snapshot.lens.id,
					lensVersion: snapshot.lens.version,
					username: entry.profile.login,
					rank: entry.rank,
					score: entry.score,
					confidence: entry.confidence,
					cohortSize: snapshot.entries.length,
					entry,
				}) satisfies RankingSeasonResult,
		),
	);
	return { seasons: [season], results };
}

export async function persistSeasonResults(
	snapshots: RankingSnapshot[],
	options: { status?: RankingSeason["status"] } = {},
) {
	if (snapshots.length === 0 || !process.env.DATABASE_URL) return;
	const { db, rankingSeason, rankingSeasonResult } = await import("@/db");
	const generatedAt = new Date(snapshots[0].generatedAt);
	const season = {
		...getSeason(generatedAt),
		status: options.status ?? getSeason(generatedAt).status,
	};
	const today = generatedAt.toISOString().slice(0, 10);

	await db
		.update(rankingSeason)
		.set({ status: "closed", closedAt: generatedAt })
		.where(
			and(eq(rankingSeason.status, "active"), lt(rankingSeason.endsAt, today)),
		);

	await db
		.insert(rankingSeason)
		.values({
			id: season.id,
			label: season.label,
			startsAt: season.startsAt,
			endsAt: season.endsAt,
			status: season.status,
			rulesetVersion: season.rulesetVersion,
		})
		.onConflictDoUpdate({
			target: rankingSeason.id,
			set: {
				label: season.label,
				startsAt: season.startsAt,
				endsAt: season.endsAt,
				rulesetVersion: season.rulesetVersion,
				status: season.status,
			},
		});

	for (const snapshot of snapshots) {
		const values = snapshot.entries.map((entry) => ({
			id: resultId(
				season.id,
				snapshot.scope,
				snapshot.lens.id,
				entry.profile.login,
			),
			seasonId: season.id,
			scope: snapshot.scope,
			lensId: snapshot.lens.id,
			lensVersion: snapshot.lens.version,
			username: entry.profile.login,
			rank: entry.rank,
			score: entry.score,
			confidence: entry.confidence,
			cohortSize: snapshot.entries.length,
			entry,
			updatedAt: generatedAt,
		}));
		if (values.length === 0) continue;
		await db
			.insert(rankingSeasonResult)
			.values(values)
			.onConflictDoUpdate({
				target: rankingSeasonResult.id,
				set: {
					rank: sql`excluded.rank`,
					score: sql`excluded.score`,
					confidence: sql`excluded.confidence`,
					cohortSize: sql`excluded.cohort_size`,
					entry: sql`excluded.entry`,
					updatedAt: generatedAt,
				},
			});
	}
}

async function readRankingSeasons(scope: string) {
	if (process.env.DATABASE_URL) {
		try {
			const { db, rankingSeason, rankingSeasonResult } = await import("@/db");
			const rows = await db
				.selectDistinct({
					id: rankingSeason.id,
					label: rankingSeason.label,
					startsAt: rankingSeason.startsAt,
					endsAt: rankingSeason.endsAt,
					status: rankingSeason.status,
					rulesetVersion: rankingSeason.rulesetVersion,
					closedAt: rankingSeason.closedAt,
				})
				.from(rankingSeason)
				.innerJoin(
					rankingSeasonResult,
					eq(rankingSeasonResult.seasonId, rankingSeason.id),
				)
				.where(eq(rankingSeasonResult.scope, scope))
				.orderBy(desc(rankingSeason.startsAt));
			return rows.map(mapSeason);
		} catch {
			return [getSeason()];
		}
	}
	return [getSeason()];
}

const getCachedRankingSeasons = unstable_cache(
	readRankingSeasons,
	["ranking-seasons-v1"],
	{ revalidate: 3600, tags: ["ranking-seasons"] },
);

export async function getRankingSeasons(scope: string) {
	return getCachedRankingSeasons(scope);
}

async function readPersistedLadder(scope: string, lensId: LensId) {
	if (!process.env.DATABASE_URL) return null;
	try {
		const { db, rankingSeason, rankingSeasonResult } = await import("@/db");
		const [seasonRows, resultRows] = await Promise.all([
			db.select().from(rankingSeason).orderBy(desc(rankingSeason.startsAt)),
			db
				.select()
				.from(rankingSeasonResult)
				.where(
					and(
						eq(rankingSeasonResult.scope, scope),
						eq(rankingSeasonResult.lensId, lensId),
					),
				)
				.orderBy(asc(rankingSeasonResult.rank)),
		]);
		if (seasonRows.length === 0 || resultRows.length === 0) return null;
		return {
			seasons: seasonRows.map(mapSeason),
			results: resultRows.map(
				(row) =>
					({
						seasonId: row.seasonId,
						scope: row.scope,
						lensId: row.lensId as LensId,
						lensVersion: row.lensVersion,
						username: row.username,
						rank: row.rank,
						score: row.score,
						confidence: row.confidence,
						cohortSize: row.cohortSize,
						entry: row.entry,
					}) satisfies RankingSeasonResult,
			),
		};
	} catch {
		return null;
	}
}

const getPersistedLadder = unstable_cache(
	readPersistedLadder,
	["ranking-ladder-v1"],
	{ revalidate: 3600, tags: ["ranking-ladders"] },
);

export async function getLadderStandings({
	scope,
	lensId = "balanced",
	mode = "all-time",
}: {
	scope: string;
	lensId?: LensId;
	mode?: "all-time" | "form";
}): Promise<{
	seasons: RankingSeason[];
	standings: CareerStanding[];
}> {
	let ladder = await getPersistedLadder(scope, lensId);
	if (!ladder) {
		const { getRankingSnapshot } = await import("./store");
		ladder = resultsFromSnapshots([
			await getRankingSnapshot(scope as RankingScope, lensId),
		]);
	}
	return {
		seasons: ladder.seasons,
		standings: buildCareerStandings({ ...ladder, lensId, mode }),
	};
}

export async function getSeasonLeaderboard({
	scope,
	seasonId,
	lensId = "balanced",
}: {
	scope: string;
	seasonId: string;
	lensId?: LensId;
}) {
	const ladder = await getPersistedLadder(scope, lensId);
	if (ladder) {
		const season = ladder.seasons.find((item) => item.id === seasonId);
		if (season) {
			return {
				season,
				results: ladder.results
					.filter((result) => result.seasonId === seasonId)
					.sort((left, right) => left.rank - right.rank),
			};
		}
	}
	const { getRankingSnapshot } = await import("./store");
	const fallback = resultsFromSnapshots([
		await getRankingSnapshot(scope as RankingScope, lensId),
	]);
	return fallback.seasons[0]?.id === seasonId
		? { season: fallback.seasons[0], results: fallback.results }
		: null;
}
