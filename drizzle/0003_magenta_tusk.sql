ALTER TABLE "user" ALTER COLUMN "stack" SET DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "stack" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "potential_roles" SET DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "potential_roles" SET NOT NULL;