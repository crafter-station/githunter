CREATE TABLE IF NOT EXISTS "user_subscription" (
  "id"                   varchar     PRIMARY KEY,
  "polar_customer_id"    varchar     NOT NULL,
  "polar_product_id"     varchar     NOT NULL,
  "user_id"              varchar     NOT NULL,
  "subscription_plan_id" varchar     NOT NULL,
  "active"               boolean     NOT NULL DEFAULT true
);

-- indexes
CREATE INDEX IF NOT EXISTS "user_subscription_user_idx"
  ON "user_subscription" ("user_id");
CREATE INDEX IF NOT EXISTS "user_subscription_plan_idx"
  ON "user_subscription" ("subscription_plan_id");
CREATE INDEX IF NOT EXISTS "user_subscription_active_idx"
  ON "user_subscription" ("active");