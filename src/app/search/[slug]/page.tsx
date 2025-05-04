import { redis } from "@/redis";
import { getQueryParams } from "./get-query-params";
import { queryUsers } from "./query-users";

export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
	// Use scan with a pattern match to get all search keys
	const searchKeys = [];
	let cursor = "0";

	do {
		const [nextCursor, keys] = await redis.scan(cursor, { match: "search:*" });
		cursor = nextCursor;
		searchKeys.push(...keys);
	} while (cursor !== "0");

	// Extract the slug from each key (remove the "search:" prefix)
	return searchKeys.map((key) => ({
		slug: key.replace("search:", ""),
	}));
}

export default async function SearchPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const searchParams = await getQueryParams(slug);

	if (Object.keys(searchParams).length === 0) {
		return (
			<div>
				<h1>SearchPage {slug}</h1>
				<pre>{JSON.stringify(searchParams, null, 2)}</pre>
				<h2>Error searching users</h2>
				<p>Sorry, we couldn't find users matching your search criteria.</p>
			</div>
		);
	}

	const usersSorted = await queryUsers(searchParams);

	console.log("generated again!");

	return (
		<div>
			<h1>SearchPage {slug}</h1>
			<pre>{JSON.stringify(searchParams, null, 2)}</pre>

			<h2>Users ({usersSorted.length})</h2>
			<pre>
				{JSON.stringify(
					usersSorted.map((u) => ({
						username: u.username,
						score: u.score,
						stars: u.stars,
						followers: u.followers,
						contributions: u.contributions,
						repositories: u.repositories,
					})),
					null,
					2,
				)}
			</pre>
		</div>
	);
}
