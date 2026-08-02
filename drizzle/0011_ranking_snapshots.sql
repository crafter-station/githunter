CREATE TABLE "ranking_metric_snapshot" (
	"id" text PRIMARY KEY NOT NULL,
	"scope" text NOT NULL,
	"username" text NOT NULL,
	"snapshot_date" date NOT NULL,
	"period_from" timestamp with time zone NOT NULL,
	"period_to" timestamp with time zone NOT NULL,
	"profile" jsonb NOT NULL,
	"metrics" jsonb NOT NULL,
	"previous_metrics" jsonb,
	"sources" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ranking_snapshot" (
	"id" text PRIMARY KEY NOT NULL,
	"scope" text NOT NULL,
	"lens_id" text NOT NULL,
	"lens_version" text NOT NULL,
	"snapshot_date" date NOT NULL,
	"generated_at" timestamp with time zone NOT NULL,
	"period" jsonb NOT NULL,
	"previous_period" jsonb,
	"cohort" jsonb NOT NULL,
	"lens" jsonb NOT NULL,
	"entries" jsonb NOT NULL,
	"sources" jsonb NOT NULL,
	"limitations" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ranking_metric_scope_user_date_idx" ON "ranking_metric_snapshot" USING btree ("scope","username","snapshot_date");--> statement-breakpoint
CREATE INDEX "ranking_metric_scope_date_idx" ON "ranking_metric_snapshot" USING btree ("scope","snapshot_date");--> statement-breakpoint
CREATE UNIQUE INDEX "ranking_scope_lens_version_date_idx" ON "ranking_snapshot" USING btree ("scope","lens_id","lens_version","snapshot_date");--> statement-breakpoint
CREATE INDEX "ranking_scope_lens_generated_idx" ON "ranking_snapshot" USING btree ("scope","lens_id","generated_at");