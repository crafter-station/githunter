import "dotenv/config";
import { refreshRankingScope } from "../src/rankings/refresh";

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is not set");

const { dataset, snapshots } = await refreshRankingScope({
	scope: "peru",
	token,
	onProgress: ({ completed, total }) =>
		console.log(`Ranking refresh ${completed}/${total}`),
});

console.log(
	JSON.stringify({
		profiles: dataset.profiles.length,
		snapshots: snapshots.map((snapshot) => snapshot.id),
		generatedAt: dataset.generatedAt,
	}),
);
