import { PopulateGithubUser } from "@/core/services/populate-github-user.service";

if (require.main === module) {
	(async () => {
		try {
			const args = process.argv.slice(2);

			if (args.length === 0) {
				throw new Error("no username provided");
			}

			const username = args[0];
			const service = new PopulateGithubUser();
			await service.exec(username, 10);
		} catch (error) {
			console.error("error executing script", error);
		}
	})();
}
