"use client";

import { RankingTableToolbar } from "@/components/rankings/ranking-table-toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { useMemo, useState } from "react";

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
	const paginationKey = `${mode}:${query}`;
	const [pagination, setPagination] = useState({
		key: paginationKey,
		visible: 50,
	});
	const visible = pagination.key === paginationKey ? pagination.visible : 50;
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
	const shown = filtered.slice(0, visible);
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
						<Table className="table-fixed">
							<TableHeader>
								<TableRow>
									<TableHead className="w-16 pr-2 pl-4! lg:w-[6%]">
										Rank
									</TableHead>
									<TableHead className="px-2 lg:w-[34%]">Developer</TableHead>
									<TableHead className="w-24 px-2 pr-4! text-right lg:w-[32%] lg:pr-3! lg:text-left">
										<span className="lg:hidden">
											{mode === "form" ? "Score" : "Points"}
										</span>
										<span className="hidden lg:inline">
											{mode === "form" ? "Form score" : "Career points"}
										</span>
									</TableHead>
									<TableHead className="hidden px-2 lg:table-cell lg:w-[12%]">
										Seasons
									</TableHead>
									<TableHead className="hidden px-2 lg:table-cell lg:w-[8%]">
										Titles
									</TableHead>
									<TableHead className="hidden pr-4! pl-2 text-right lg:table-cell lg:w-[8%]">
										Current
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{shown.map((standing) => {
									const displayName =
										standing.profile.name || standing.profile.login;
									return (
										<TableRow key={standing.profile.login}>
											<TableCell className="pr-2 pl-4!">
												<strong className="tabular-nums">
													#{standing.rank}
												</strong>
											</TableCell>
											<TableCell className="overflow-hidden px-2">
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
											<TableCell className="px-2 pr-4! text-right lg:pr-3! lg:text-left">
												<strong className="tabular-nums">
													{mode === "form"
														? standing.formScore.toFixed(2)
														: standing.careerPoints.toFixed(2)}
												</strong>
											</TableCell>
											<TableCell className="hidden px-2 tabular-nums lg:table-cell">
												{standing.seasons}
											</TableCell>
											<TableCell className="hidden px-2 tabular-nums lg:table-cell">
												{standing.championships}
											</TableCell>
											<TableCell className="hidden pr-4! pl-2 text-right tabular-nums lg:table-cell">
												{standing.currentRank
													? `#${standing.currentRank}`
													: "—"}
											</TableCell>
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
				{shown.length < filtered.length ? (
					<CardFooter className="justify-center py-3">
						<Button
							size="sm"
							variant="outline"
							onClick={() =>
								setPagination({ key: paginationKey, visible: visible + 50 })
							}
						>
							Show 50 more
						</Button>
					</CardFooter>
				) : null}
			</Card>
		</section>
	);
}
