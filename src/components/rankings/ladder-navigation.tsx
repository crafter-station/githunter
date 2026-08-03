"use client";

import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rankingLenses } from "@/rankings/lenses";
import { type RankingView, rankingFilterParsers } from "@/rankings/query-state";
import type { LensId, RankingSeason } from "@/rankings/types";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";

export function LadderNavigation({
	active,
	season,
	seasons,
	lensId,
}: {
	active: "current" | "form" | "all-time" | "season";
	season: RankingSeason;
	seasons: RankingSeason[];
	lensId: LensId;
}) {
	const [isPending, startTransition] = useTransition();
	const [, setFilters] = useQueryStates(rankingFilterParsers, {
		history: "push",
		shallow: false,
		startTransition,
	});
	const changeView = (view: RankingView) => {
		void setFilters({
			view,
			season: view === "season" ? season.id : null,
		});
	};

	return (
		<div className={styles.rankingControls} aria-busy={isPending}>
			<Tabs
				value={active === "season" ? "current" : active}
				onValueChange={(value) => changeView(value as RankingView)}
			>
				<TabsList aria-label="Ladder standings">
					<TabsTrigger value="current">Standings</TabsTrigger>
					<TabsTrigger value="form">Form</TabsTrigger>
					<TabsTrigger value="all-time">All-time</TabsTrigger>
				</TabsList>
			</Tabs>
			<div className={styles.rankingFilters}>
				<Select
					value={season.id}
					onValueChange={(value) =>
						void setFilters({ view: "season", season: value })
					}
				>
					<SelectTrigger aria-label="Season">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Season</SelectLabel>
							{seasons.map((item) => (
								<SelectItem key={item.id} value={item.id}>
									{item.label} · {item.status}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Separator orientation="vertical" />
				<Select
					value={lensId}
					onValueChange={(value) => void setFilters({ lens: value as LensId })}
				>
					<SelectTrigger aria-label="Ranking lens">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Ranking lens</SelectLabel>
							{Object.values(rankingLenses).map((lens) => (
								<SelectItem key={lens.id} value={lens.id}>
									{lens.shortName}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Badge variant="secondary">{season.status}</Badge>
			</div>
		</div>
	);
}
