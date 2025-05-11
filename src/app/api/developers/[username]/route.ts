import { getUserByUsername } from "@/db/query/user";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { username: string } },
) {
	try {
		const { username } = params;

		if (!username) {
			return NextResponse.json(
				{ error: "Username is required" },
				{ status: 400 },
			);
		}

		const userData = await getUserByUsername(username);

		if (!userData) {
			return NextResponse.json(
				{ error: "Developer not found" },
				{ status: 404 },
			);
		}

		// Calculate contributions if needed
		const contributions = {
			issues: 0,
			pullRequests: 0,
			commits: 0,
		};

		if (userData.repos) {
			for (const repo of userData.repos) {
				if (repo.contribution) {
					contributions.issues += repo.contribution.issuesCount || 0;
					contributions.pullRequests +=
						repo.contribution.pullRequestsCount || 0;
					contributions.commits += repo.contribution.commitsCount || 0;
				}
			}
		}

		// Format the response
		const developerData = {
			id: userData.id,
			username: userData.username,
			fullname: userData.fullname || userData.username,
			avatarUrl: userData.avatarUrl,
			metrics: {
				followers: userData.followers,
				stars: userData.stars,
				repositories: userData.repositories,
				issues: contributions.issues,
				pullRequests: contributions.pullRequests,
				commits: contributions.commits,
			},
		};

		return NextResponse.json(developerData);
	} catch (error) {
		console.error("Error fetching developer data:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
