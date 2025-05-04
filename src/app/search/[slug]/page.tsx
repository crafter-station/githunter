import { getQueryParams } from "./get-query-params";
import { queryUsers } from "./query-users";

export const revalidate = 300;

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
