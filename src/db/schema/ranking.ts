import type {
	LensDefinition,
	RankingCandidateEvaluation,
	RankingDataset,
	RankingEntry,
	RankingMetrics,
	RankingProfile,
} from "@/rankings/types";
import {
	date,
	doublePrecision,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const rankingMetricSnapshot = pgTable(
	"ranking_metric_snapshot",
	{
		id: text("id").primaryKey(),
		scope: text("scope").notNull(),
		username: text("username").notNull(),
		snapshotDate: date("snapshot_date").notNull(),
		periodFrom: timestamp("period_from", { withTimezone: true }).notNull(),
		periodTo: timestamp("period_to", { withTimezone: true }).notNull(),
		profile: jsonb("profile").notNull().$type<RankingProfile>(),
		metrics: jsonb("metrics").notNull().$type<RankingMetrics>(),
		previousMetrics: jsonb("previous_metrics").$type<Partial<RankingMetrics>>(),
		sources: jsonb("sources").notNull().$type<string[]>(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		uniqueIndex("ranking_metric_scope_user_date_idx").on(
			table.scope,
			table.username,
			table.snapshotDate,
		),
		index("ranking_metric_scope_date_idx").on(table.scope, table.snapshotDate),
	],
);

export const rankingSnapshot = pgTable(
	"ranking_snapshot",
	{
		id: text("id").primaryKey(),
		scope: text("scope").notNull(),
		lensId: text("lens_id").notNull(),
		lensVersion: text("lens_version").notNull(),
		snapshotDate: date("snapshot_date").notNull(),
		generatedAt: timestamp("generated_at", { withTimezone: true }).notNull(),
		period: jsonb("period").notNull().$type<RankingDataset["period"]>(),
		previousPeriod:
			jsonb("previous_period").$type<RankingDataset["previousPeriod"]>(),
		cohort: jsonb("cohort").notNull().$type<RankingDataset["cohort"]>(),
		lens: jsonb("lens").notNull().$type<LensDefinition>(),
		entries: jsonb("entries").notNull().$type<RankingEntry[]>(),
		sources: jsonb("sources").notNull().$type<string[]>(),
		limitations: jsonb("limitations").notNull().$type<string[]>(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		uniqueIndex("ranking_scope_lens_version_date_idx").on(
			table.scope,
			table.lensId,
			table.lensVersion,
			table.snapshotDate,
		),
		index("ranking_scope_lens_generated_idx").on(
			table.scope,
			table.lensId,
			table.generatedAt,
		),
	],
);

export const rankingSeason = pgTable("ranking_season", {
	id: text("id").primaryKey(),
	label: text("label").notNull(),
	startsAt: date("starts_at").notNull(),
	endsAt: date("ends_at").notNull(),
	status: text("status").notNull(),
	rulesetVersion: text("ruleset_version").notNull(),
	closedAt: timestamp("closed_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const rankingSeasonResult = pgTable(
	"ranking_season_result",
	{
		id: text("id").primaryKey(),
		seasonId: text("season_id")
			.notNull()
			.references(() => rankingSeason.id),
		scope: text("scope").notNull(),
		lensId: text("lens_id").notNull(),
		lensVersion: text("lens_version").notNull(),
		username: text("username").notNull(),
		rank: integer("rank").notNull(),
		score: doublePrecision("score").notNull(),
		confidence: integer("confidence").notNull(),
		cohortSize: integer("cohort_size").notNull(),
		entry: jsonb("entry").notNull().$type<RankingEntry>(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		uniqueIndex("ranking_season_scope_lens_user_idx").on(
			table.seasonId,
			table.scope,
			table.lensId,
			table.username,
		),
		index("ranking_season_scope_lens_rank_idx").on(
			table.seasonId,
			table.scope,
			table.lensId,
			table.rank,
		),
		index("ranking_season_username_idx").on(table.username),
	],
);

export const rankingCandidate = pgTable(
	"ranking_candidate",
	{
		id: text("id").primaryKey(),
		scope: text("scope").notNull(),
		username: text("username").notNull(),
		status: text("status").notNull(),
		evaluation: jsonb("evaluation").$type<RankingCandidateEvaluation>(),
		submittedAt: timestamp("submitted_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		evaluatedAt: timestamp("evaluated_at", { withTimezone: true }),
	},
	(table) => [
		uniqueIndex("ranking_candidate_scope_username_idx").on(
			table.scope,
			table.username,
		),
		index("ranking_candidate_status_idx").on(table.status),
	],
);
