CREATE INDEX "roles_idx" ON "user" USING gin ("potential_roles");--> statement-breakpoint
CREATE INDEX "stack_idx" ON "user" USING gin ("stack");--> statement-breakpoint
CREATE INDEX "city_idx" ON "user" USING btree ("city");--> statement-breakpoint
CREATE INDEX "country_idx" ON "user" USING btree ("country");--> statement-breakpoint
CREATE INDEX "contributions_idx" ON "user" USING btree ("contributions");--> statement-breakpoint
CREATE INDEX "roles_only_gin_idx" ON "user" USING gin ("potential_roles");--> statement-breakpoint
CREATE INDEX "stack_only_gin_idx" ON "user" USING gin ("stack");--> statement-breakpoint
CREATE INDEX "city_country_idx" ON "user" USING btree ("city","country");--> statement-breakpoint
CREATE INDEX "repos_gin_idx" ON "user" USING gin ("repos");