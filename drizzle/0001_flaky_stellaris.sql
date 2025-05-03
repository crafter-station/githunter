ALTER TABLE "user" ADD COLUMN "repositories" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "contributions" integer DEFAULT 0 NOT NULL;