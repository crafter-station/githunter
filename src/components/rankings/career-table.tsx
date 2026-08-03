"use client";

import { RankingTableToolbar } from "@/components/rankings/ranking-table-toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CareerStanding } from "@/rankings/types";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

function initials(value: string) {
	return value
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

export function CareerTable({
	standings,
	mode,
}: {
	standings: CareerStanding[];
	mode: "all-time" | "form";
}) {
	const [query, setQuery] = useQueryState(
		"q",
		parseAsString
			.withDefault("")
			.withOptions({ history: "replace", clearOnDefault: true }),
	);
	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return standings;
		return standings.filter((standing) =>
			[standing.profile.login, standing.profile.name, standing.profile.location]
				.join(" ")
				.toLowerCase()
				.includes(normalized),
		);
	}, [query, standings]);
	const projected = standings.some((standing) => standing.provisional);

	return (
		<section
			id="ranking"
			aria-labelledby="career-ranking-filter-title"
			className="min-w-0 max-w-full py-6"
		>
			<Card className="min-w-0 max-w-full gap-0 overflow-hidden py-0">
				<RankingTableToolbar
					id="career-ranking-filter"
					status={mode === "form" ? "Form" : "All-time"}
					meta={`${standings.length} developers${projected ? " · projected" : ""}`}
					title={mode === "form" ? "Four-quarter form" : "Career standings"}
					description={
						mode === "form"
							? "Average score across the latest four available seasons."
							: "Official season points, titles, and current standing."
					}
					query={query}
					placeholder="Search developer"
					onQueryChange={(value) => void setQuery(value)}
				/>
				<CardContent className="p-0">
					{filtered.length > 0 ? (
						<Table className="table-fixed lg:table-auto">
							<TableHeader>
								<TableRow>
									<TableHead className="w-14 lg:w-16">Rank</TableHead>
									<TableHead>Developer</TableHead>
									<TableHead className="w-24 text-right lg:w-36 lg:text-left">
										{mode === "form" ? "Form score" : "Career points"}
									</TableHead>
									<TableHead className="hidden w-32 lg:table-cell">
										Seasons
									</TableHead>
									<TableHead className="hidden w-24 lg:table-cell">
										Titles
									</TableHead>
									{mode === "all-time" ? (
										<TableHead className="hidden w-24 text-right lg:table-cell">
											Current
										</TableHead>
									) : null}
								</TableRow>
							</TableHeader>
							<TableBody>
								{filtered.map((standing) => {
									const displayName =
										standing.profile.name || standing.profile.login;
									return (
										<TableRow key={standing.profile.login}>
											<TableCell>
												<strong className="tabular-nums">
													#{standing.rank}
												</strong>
											</TableCell>
											<TableCell className="overflow-hidden">
												<Link
													href={`/developer/${standing.profile.login}`}
													className="flex min-w-0 items-center gap-3"
												>
													<Avatar className="size-9 rounded-md">
														<AvatarImage
															src={standing.profile.avatarUrl}
															alt=""
														/>
														<AvatarFallback className="rounded-md">
															{initials(displayName)}
														</AvatarFallback>
													</Avatar>
													<span className="flex min-w-0 flex-col">
														<span className="truncate font-medium">
															{displayName}
														</span>
														<span className="truncate text-muted-foreground text-xs">
															@{standing.profile.login}
														</span>
													</span>
												</Link>
											</TableCell>
											<TableCell className="text-right lg:text-left">
												<strong className="tabular-nums">
													{mode === "form"
														? standing.formScore.toFixed(2)
														: standing.careerPoints.toFixed(2)}
												</strong>
											</TableCell>
											<TableCell className="hidden tabular-nums lg:table-cell">
												{standing.seasons}
											</TableCell>
											<TableCell className="hidden tabular-nums lg:table-cell">
												{standing.championships}
											</TableCell>
											{mode === "all-time" ? (
												<TableCell className="hidden text-right tabular-nums lg:table-cell">
													{standing.currentRank
														? `#${standing.currentRank}`
														: "—"}
												</TableCell>
											) : null}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					) : (
						<Empty>
							<EmptyHeader>
								<EmptyTitle>No matching developer</EmptyTitle>
								<EmptyDescription>
									No ladder entry matches “{query}”.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
