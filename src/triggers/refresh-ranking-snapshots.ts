import { refreshRankingScope } from "@/rankings/refresh";
import { type RankingScope, rankingScopes } from "@/rankings/scopes";
import { logger, schedules } from "@trigger.dev/sdk/v3";

export const refreshRankingSnapshots = schedules.task({
	id: "refresh-ranking-snapshots",
	cron: {
		pattern: "0 6 * * *",
		timezone: "America/Lima",
	},
	maxDuration: 3600,
	run: async () => {
		const token = process.env.GITHUB_TOKEN;
		if (!token) throw new Error("GITHUB_TOKEN is not set");
		const results = [];
		for (const scope of Object.keys(rankingScopes) as RankingScope[]) {
			const { dataset, snapshots } = await refreshRankingScope({
				scope,
				token,
				onProgress: ({ completed, total }) =>
					logger.info(`${rankingScopes[scope].name} ${completed}/${total}`),
			});
			results.push({
				scope,
				profiles: dataset.profiles.length,
				snapshots: snapshots.map((snapshot) => snapshot.id),
				generatedAt: dataset.generatedAt,
			});
		}
		return results;
	},
});
