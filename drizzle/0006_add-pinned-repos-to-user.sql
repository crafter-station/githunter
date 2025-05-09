-- ✨ UP
ALTER TABLE "user" ADD COLUMN "pinned_repos" jsonb[] DEFAULT '{}'::jsonb[];

-- 🔄 DOWN
ALTER TABLE "user" DROP COLUMN "pinned_repos";