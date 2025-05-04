import { UserSchema } from "@/core/models/user";
import { UserRepository } from "@/core/repositories/user-repository";
import { schemaTask } from "@trigger.dev/sdk/v3";

export const insertUserToDbTask = schemaTask({
	id: "insert-user-to-db",
	schema: UserSchema,
	run: async (user) => {
		const userRepo = new UserRepository();
		const existingUser = await userRepo.findByUsername(user.username);
		if (existingUser) {
			user.id = existingUser.id;
			await userRepo.update(user);
		} else {
			await userRepo.insert(user);
		}
	},
});
