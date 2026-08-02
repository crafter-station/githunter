import "dotenv/config";
import { getBundledDataset } from "../src/rankings/data";
import { persistRankingDataset } from "../src/rankings/store";

const dataset = getBundledDataset("peru");
const snapshots = await persistRankingDataset(dataset);

console.log(
	JSON.stringify({
		season: dataset.generatedAt.slice(0, 10),
		profiles: dataset.profiles.length,
		lenses: snapshots.map((snapshot) => snapshot.lens.id),
	}),
);
