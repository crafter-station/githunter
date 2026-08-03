import "dotenv/config";
import { refreshRankingScope } from "../src/rankings/refresh";
import {
	type RankingScope,
	isRankingScope,
	rankingScopes,
} from "../src/rankings/scopes";

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is not set");

const requestedScope = process.argv[2]?.toLowerCase();
if (requestedScope && !isRankingScope(requestedScope)) {
	throw new Error(`Unsupported ranking scope: ${requestedScope}`);
}
const scopes: RankingScope[] = requestedScope
	? [requestedScope as RankingScope]
	: (Object.keys(rankingScopes) as RankingScope[]);
const results = [];

for (const scope of scopes) {
	const { dataset, snapshots } = await refreshRankingScope({
		scope,
		token,
		onProgress: ({ completed, total }) =>
			console.log(`${rankingScopes[scope].name} ${completed}/${total}`),
	});
	results.push({
		scope,
		profiles: dataset.profiles.length,
		snapshots: snapshots.map((snapshot) => snapshot.id),
		generatedAt: dataset.generatedAt,
	});
}

console.log(JSON.stringify(results));
