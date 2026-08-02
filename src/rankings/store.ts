import { Redis } from "@upstash/redis";
import { and, desc, eq, lt, sql } from "drizzle-orm";
import { type RankingScope, bundledDatasets, getBundledDataset } from "./data";
import { getLens, rankingLenses } from "./lenses";
import { buildRankingSnapshot } from "./score";
import type { LensId, RankingDataset, RankingSnapshot } from "./types";

const memorySnapshots = new Map<string, RankingSnapshot>();

function cacheKey(scope: string, lens: LensId, version: string) {
	return `ranking:latest:${scope}:${lens}:${version}`;
}

function getRedis() {
	const url = process.env.UPSTASH_REDIS_REST_URL;
	const token = process.env.UPSTASH_REDIS_REST_TOKEN;
	return url && token ? new Redis({ url, token }) : null;
}

export function isRankingSnapshot(
	value: unknown,
	scope: string,
	lensId: LensId,
	version: string,
): value is RankingSnapshot {
	if (!value || typeof value !== "object") return false;
	const snapshot = value as Partial<RankingSnapshot>;
	return (
		snapshot.scope === scope &&
		snapshot.lens?.id === lensId &&
		snapshot.lens.version === version &&
		typeof snapshot.generatedAt === "string" &&
		!Number.isNaN(Date.parse(snapshot.generatedAt)) &&
		Array.isArray(snapshot.entries) &&
		snapshot.entries.every(
			(entry) =>
				typeof entry.rank === "number" &&
				typeof entry.score === "number" &&
				typeof entry.profile?.login === "string" &&
				Array.isArray(entry.breakdown),
		)
	);
}

function bundledSnapshot(scope: RankingScope, lensId: LensId) {
	const lens = rankingLenses[lensId];
	const key = cacheKey(scope, lensId, lens.version);
	const existing = memorySnapshots.get(key);
	if (existing) return existing;
	const snapshot = buildRankingSnapshot(getBundledDataset(scope), lens);
	memorySnapshots.set(key, snapshot);
	return snapshot;
}

async function getRedisSnapshot(scope: RankingScope, lensId: LensId) {
	const redis = getRedis();
	if (!redis) return null;
	try {
		const lens = rankingLenses[lensId];
		const snapshot = await redis.get<RankingSnapshot>(
			cacheKey(scope, lensId, lens.version),
		);
		return isRankingSnapshot(snapshot, scope, lensId, lens.version)
			? { ...snapshot, cache: "redis" as const }
			: null;
	} catch {
		return null;
	}
}

async function getDatabaseSnapshot(scope: RankingScope, lensId: LensId) {
	if (!process.env.DATABASE_URL) return null;
	try {
		const { db, rankingSnapshot } = await import("@/db");
		const [row] = await db
			.select()
			.from(rankingSnapshot)
			.where(
				and(
					eq(rankingSnapshot.scope, scope),
					eq(rankingSnapshot.lensId, lensId),
					eq(rankingSnapshot.lensVersion, rankingLenses[lensId].version),
				),
			)
			.orderBy(desc(rankingSnapshot.generatedAt))
			.limit(1);
		if (!row) return null;
		const snapshot = {
			id: row.id,
			scope: row.scope,
			scopeName: row.scope === "peru" ? "Peru" : row.scope,
			lens: row.lens,
			generatedAt: row.generatedAt.toISOString(),
			period: row.period,
			previousPeriod: row.previousPeriod ?? undefined,
			cohort: row.cohort,
			sources: row.sources,
			limitations: row.limitations,
			entries: row.entries,
			cache: "database" as const,
		} satisfies RankingSnapshot;
		return isRankingSnapshot(
			snapshot,
			scope,
			lensId,
			rankingLenses[lensId].version,
		)
			? snapshot
			: null;
	} catch {
		return null;
	}
}

async function cacheSnapshot(snapshot: RankingSnapshot) {
	const redis = getRedis();
	if (!redis) return;
	try {
		await redis.set(
			cacheKey(snapshot.scope, snapshot.lens.id, snapshot.lens.version),
			snapshot,
			{ ex: 60 * 60 * 26 },
		);
	} catch {
		return;
	}
}

export function selectFreshestSnapshot(snapshots: RankingSnapshot[]) {
	return snapshots.reduce((freshest, snapshot) =>
		Date.parse(snapshot.generatedAt) > Date.parse(freshest.generatedAt)
			? snapshot
			: freshest,
	);
}

export async function getRankingSnapshot(scope: RankingScope, lensId: LensId) {
	const fallback = bundledSnapshot(scope, lensId);
	const [redisSnapshot, databaseSnapshot] = await Promise.all([
		getRedisSnapshot(scope, lensId),
		getDatabaseSnapshot(scope, lensId),
	]);
	const candidates = [fallback, redisSnapshot, databaseSnapshot].filter(
		(snapshot): snapshot is RankingSnapshot => snapshot !== null,
	);
	const freshest = selectFreshestSnapshot(candidates);
	if (freshest.cache !== "redis") await cacheSnapshot(freshest);
	return freshest;
}

export async function persistRankingDataset(dataset: RankingDataset) {
	const { db, rankingMetricSnapshot, rankingSnapshot } = await import("@/db");
	const snapshotDate = dataset.generatedAt.slice(0, 10);
	const lenses = Object.values(rankingLenses);
	const previousEntries = await Promise.all(
		lenses.map(async (lens) => {
			const [row] = await db
				.select({ entries: rankingSnapshot.entries })
				.from(rankingSnapshot)
				.where(
					and(
						eq(rankingSnapshot.scope, dataset.scope),
						eq(rankingSnapshot.lensId, lens.id),
						eq(rankingSnapshot.lensVersion, lens.version),
						lt(rankingSnapshot.snapshotDate, snapshotDate),
					),
				)
				.orderBy(desc(rankingSnapshot.snapshotDate))
				.limit(1);
			return row?.entries;
		}),
	);
	const metricRows = dataset.profiles.map((profile) => ({
		id: `${dataset.scope}:${profile.login.toLowerCase()}:${snapshotDate}`,
		scope: dataset.scope,
		username: profile.login,
		snapshotDate,
		periodFrom: new Date(dataset.period.from),
		periodTo: new Date(dataset.period.to),
		profile,
		metrics: profile.metrics,
		previousMetrics: profile.previousMetrics,
		sources: dataset.sources,
	}));
	await db
		.insert(rankingMetricSnapshot)
		.values(metricRows)
		.onConflictDoUpdate({
			target: rankingMetricSnapshot.id,
			set: {
				periodFrom: new Date(dataset.period.from),
				periodTo: new Date(dataset.period.to),
				profile: sql`excluded.profile`,
				metrics: sql`excluded.metrics`,
				previousMetrics: sql`excluded.previous_metrics`,
				sources: dataset.sources,
			},
		});

	const snapshots = lenses.map((lens, index) =>
		buildRankingSnapshot(dataset, lens, previousEntries[index]),
	);
	for (const snapshot of snapshots) {
		await db
			.insert(rankingSnapshot)
			.values({
				id: snapshot.id,
				scope: snapshot.scope,
				lensId: snapshot.lens.id,
				lensVersion: snapshot.lens.version,
				snapshotDate,
				generatedAt: new Date(snapshot.generatedAt),
				period: snapshot.period,
				previousPeriod: snapshot.previousPeriod,
				cohort: snapshot.cohort,
				lens: snapshot.lens,
				entries: snapshot.entries,
				sources: snapshot.sources,
				limitations: snapshot.limitations,
			})
			.onConflictDoUpdate({
				target: rankingSnapshot.id,
				set: {
					generatedAt: new Date(snapshot.generatedAt),
					period: snapshot.period,
					previousPeriod: snapshot.previousPeriod,
					cohort: snapshot.cohort,
					lens: snapshot.lens,
					entries: snapshot.entries,
					sources: snapshot.sources,
					limitations: snapshot.limitations,
				},
			});
	}

	const { persistSeasonResults } = await import("./season-store");
	await persistSeasonResults(snapshots);

	const redis = getRedis();
	if (redis) {
		await Promise.allSettled(
			snapshots.map((snapshot) =>
				redis.set(
					cacheKey(snapshot.scope, snapshot.lens.id, snapshot.lens.version),
					snapshot,
					{ ex: 60 * 60 * 26 },
				),
			),
		);
	}

	return snapshots;
}

export function getAvailableScopes() {
	return Object.keys(bundledDatasets) as RankingScope[];
}

export function resolveLens(value: string) {
	return getLens(value);
}
