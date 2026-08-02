import type {
	LensDefinition,
	RankingDataset,
	RankingEntry,
	RankingMetrics,
	RankingProfile,
} from "@/rankings/types";
import {
	date,
	index,
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
