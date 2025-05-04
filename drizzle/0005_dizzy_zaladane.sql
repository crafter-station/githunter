ALTER TABLE "user" ALTER COLUMN "repos" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "username_idx" ON "user" USING btree ("username");--> statement-breakpoint
CREATE INDEX "stars_idx" ON "user" USING btree ("stars");--> statement-breakpoint
CREATE INDEX "followers_idx" ON "user" USING btree ("followers");--> statement-breakpoint
CREATE INDEX "repositories_idx" ON "user" USING btree ("repositories");--> statement-breakpoint
CREATE INDEX "stars_contributions_idx" ON "user" USING btree ("stars","contributions");--> statement-breakpoint
CREATE INDEX "followers_stars_idx" ON "user" USING btree ("followers","stars");--> statement-breakpoint
CREATE INDEX "email_idx" ON "user" USING btree ("email");