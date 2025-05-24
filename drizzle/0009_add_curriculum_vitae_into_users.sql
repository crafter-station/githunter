-- ✨ UP
ALTER TABLE "user" ADD COLUMN "curriculum_vitae" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint

-- 🔄 DOWN
ALTER TABLE "user" DROP COLUMN "curriculum_vitae";
