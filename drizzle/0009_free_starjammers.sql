CREATE TABLE "subscription_plan" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"amount" integer NOT NULL,
	"polar_product_id" varchar NOT NULL,
	"polar_price_id" varchar NOT NULL,
	"is_sandbox" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_subscription" (
	"id" varchar PRIMARY KEY NOT NULL,
	"polar_customer_id" varchar NOT NULL,
	"polar_product_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"subscription_plan_id" varchar NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "curriculum_vitae" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
CREATE INDEX "subscription_plan_product_idx" ON "subscription_plan" USING btree ("polar_product_id");--> statement-breakpoint
CREATE INDEX "subscription_plan_price_idx" ON "subscription_plan" USING btree ("polar_price_id");--> statement-breakpoint
CREATE INDEX "subscription_plan_sandbox_idx" ON "subscription_plan" USING btree ("is_sandbox");--> statement-breakpoint
CREATE INDEX "user_subscription_user_idx" ON "user_subscription" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_subscription_plan_idx" ON "user_subscription" USING btree ("subscription_plan_id");--> statement-breakpoint
CREATE INDEX "user_subscription_active_idx" ON "user_subscription" USING btree ("active");