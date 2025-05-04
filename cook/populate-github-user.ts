import { UserRepository } from "@/core/repositories/user-repository";
import { PopulateGithubUser } from "@/core/services/populate-github-user.service";

if (require.main === module) {
	(async () => {
		try {
			const args = process.argv.slice(2);

			if (args.length === 0) {
				throw new Error("no username provided");
			}

			const username = args[0];
			let twitterUsername: string | null = null;
			let country: string | null = null;

			if (args.length > 1) {
				country = args[1];
			}

			if (args.length > 2) {
				twitterUsername = args[2];
			}

			const userRepository = new UserRepository();
			const existingUser = await userRepository.findByUsername(username);
			if (existingUser) {
				console.log(`github username ${username} already processed, skipping`);
				return;
			}

			const service = new PopulateGithubUser();
			await service.exec(username, country, twitterUsername, 10);
		} catch (error) {
			console.error("error executing script", error);
		}
	})();
}
