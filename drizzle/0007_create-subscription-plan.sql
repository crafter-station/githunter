CREATE TABLE IF NOT EXISTS "subscription_plan" (
  "id"               varchar     PRIMARY KEY,
  "name"             varchar     NOT NULL,
  "currency"         varchar     NOT NULL,
  "amount"           integer     NOT NULL,
  "polar_product_id" varchar     NOT NULL,
  "polar_price_id"   varchar     NOT NULL,
  "is_sandbox"       boolean     NOT NULL DEFAULT false
);

-- indexes
CREATE INDEX IF NOT EXISTS "subscription_plan_product_idx"
  ON "subscription_plan" ("polar_product_id");
CREATE INDEX IF NOT EXISTS "subscription_plan_price_idx"
  ON "subscription_plan" ("polar_price_id");
CREATE INDEX IF NOT EXISTS "subscription_plan_sandbox_idx"
  ON "subscription_plan" ("is_sandbox");