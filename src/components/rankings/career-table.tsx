"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CareerStanding } from "@/rankings/types";
import { ArrowUpRight, Trophy } from "lucide-react";
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

	return (
		<section
			id="ranking"
			aria-labelledby="career-ranking-title"
			className="min-w-0 max-w-full py-8"
		>
			<Card className="min-w-0 max-w-full overflow-hidden">
				<CardHeader>
					<div className="flex flex-col gap-3">
						<Badge variant="outline">{standings.length} ladder careers</Badge>
						<CardTitle id="career-ranking-title">
							{mode === "form" ? "Four-quarter form" : "Career standings"}
						</CardTitle>
						<CardDescription>
							{mode === "form"
								? "Average score across the latest four available seasons."
								: "Career points are the sum of official season scores. Before the first official close, standings remain projected."}
						</CardDescription>
					</div>
					<label htmlFor="career-filter" className="w-full max-w-sm">
						<span className="sr-only">Search ladder careers</span>
						<Input
							id="career-filter"
							value={query}
							onChange={(event) => void setQuery(event.target.value)}
							placeholder="Search GitHub career"
						/>
					</label>
				</CardHeader>
				<CardContent className="p-0">
					{filtered.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Rank</TableHead>
									<TableHead>Developer</TableHead>
									<TableHead>
										{mode === "form" ? "Form" : "Career points"}
									</TableHead>
									<TableHead>Official seasons</TableHead>
									<TableHead>Titles</TableHead>
									<TableHead className="text-right">Current</TableHead>
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
													{standing.rank}
												</strong>
											</TableCell>
											<TableCell>
												<Link
													href={`/developer/${standing.profile.login}`}
													className="flex items-center gap-3"
												>
													<Avatar className="size-10 rounded-md">
														<AvatarImage
															src={standing.profile.avatarUrl}
															alt=""
														/>
														<AvatarFallback className="rounded-md">
															{initials(displayName)}
														</AvatarFallback>
													</Avatar>
													<span className="flex min-w-0 flex-col gap-1">
														<span className="flex items-center gap-1 font-medium">
															{displayName}
															<ArrowUpRight aria-hidden="true" />
														</span>
														<span className="truncate text-muted-foreground text-xs">
															@{standing.profile.login}
														</span>
													</span>
												</Link>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<strong className="tabular-nums">
														{mode === "form"
															? standing.formScore.toFixed(2)
															: standing.careerPoints.toFixed(2)}
													</strong>
													{standing.provisional ? (
														<Badge variant="secondary">Projected</Badge>
													) : null}
												</div>
											</TableCell>
											<TableCell className="tabular-nums">
												{standing.seasons}
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													<Trophy data-icon="inline-start" aria-hidden="true" />
													{standing.championships}
												</Badge>
											</TableCell>
											<TableCell className="text-right tabular-nums">
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
								<EmptyTitle>No matching GitHub career</EmptyTitle>
								<EmptyDescription>
									No ladder career matches “{query}”.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
