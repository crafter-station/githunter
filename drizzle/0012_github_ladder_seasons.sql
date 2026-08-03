CREATE TABLE "ranking_candidate" (
	"id" text PRIMARY KEY NOT NULL,
	"scope" text NOT NULL,
	"username" text NOT NULL,
	"status" text NOT NULL,
	"evaluation" jsonb,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"evaluated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ranking_season" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"starts_at" date NOT NULL,
	"ends_at" date NOT NULL,
	"status" text NOT NULL,
	"ruleset_version" text NOT NULL,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ranking_season_result" (
	"id" text PRIMARY KEY NOT NULL,
	"season_id" text NOT NULL,
	"scope" text NOT NULL,
	"lens_id" text NOT NULL,
	"lens_version" text NOT NULL,
	"username" text NOT NULL,
	"rank" integer NOT NULL,
	"score" double precision NOT NULL,
	"confidence" integer NOT NULL,
	"cohort_size" integer NOT NULL,
	"entry" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ranking_season_result" ADD CONSTRAINT "ranking_season_result_season_id_ranking_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."ranking_season"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ranking_candidate_scope_username_idx" ON "ranking_candidate" USING btree ("scope","username");--> statement-breakpoint
CREATE INDEX "ranking_candidate_status_idx" ON "ranking_candidate" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "ranking_season_scope_lens_user_idx" ON "ranking_season_result" USING btree ("season_id","scope","lens_id","username");--> statement-breakpoint
CREATE INDEX "ranking_season_scope_lens_rank_idx" ON "ranking_season_result" USING btree ("season_id","scope","lens_id","rank");--> statement-breakpoint
CREATE INDEX "ranking_season_username_idx" ON "ranking_season_result" USING btree ("username");