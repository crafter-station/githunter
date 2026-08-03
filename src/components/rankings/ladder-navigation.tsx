"use client";

import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rankingLenses } from "@/rankings/lenses";
import { type RankingView, rankingFilterParsers } from "@/rankings/query-state";
import type { LensId, RankingSeason } from "@/rankings/types";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useEffect, useState, useTransition } from "react";

function rankingHref(changes: {
	view?: RankingView;
	lens?: LensId;
	season?: string | null;
}) {
	const params = new URLSearchParams(window.location.search);
	for (const [key, value] of Object.entries(changes)) {
		if (value === null || value === "current" || value === "balanced") {
			params.delete(key);
		} else if (value) {
			params.set(key, value);
		}
	}
	const query = params.toString();
	return query ? `/peru?${query}` : "/peru";
}

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
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [, setFilters] = useQueryStates(rankingFilterParsers, {
		history: "push",
		shallow: false,
		startTransition,
	});
	const [optimisticView, setOptimisticView] = useState<RankingView>(active);
	const [optimisticLens, setOptimisticLens] = useState<LensId>(lensId);
	const [optimisticSeason, setOptimisticSeason] = useState(season.id);
	const selectedSeason =
		seasons.find((item) => item.id === optimisticSeason) ?? season;
	const selectedLens = rankingLenses[optimisticLens];

	useEffect(() => setOptimisticView(active), [active]);
	useEffect(() => setOptimisticLens(lensId), [lensId]);
	useEffect(() => setOptimisticSeason(season.id), [season.id]);

	const prefetchView = (view: RankingView) => {
		router.prefetch(
			rankingHref({ view, season: view === "current" ? null : undefined }),
		);
	};

	const prefetchLenses = () => {
		for (const lens of Object.values(rankingLenses)) {
			router.prefetch(rankingHref({ lens: lens.id }));
		}
	};

	const prefetchSeasons = () => {
		for (const item of seasons) {
			router.prefetch(rankingHref({ view: "season", season: item.id }));
		}
	};

	const changeView = (view: RankingView) => {
		setOptimisticView(view);
		void setFilters({
			view,
			season: view === "season" ? optimisticSeason : null,
		});
	};

	const changeSeason = (value: string) => {
		setOptimisticSeason(value);
		setOptimisticView("season");
		void setFilters({ view: "season", season: value });
	};

	const changeLens = (value: string) => {
		const nextLens = value as LensId;
		setOptimisticLens(nextLens);
		void setFilters({ lens: nextLens });
	};

	return (
		<div className={styles.rankingControls} aria-busy={isPending}>
			<Tabs
				value={optimisticView === "season" ? "current" : optimisticView}
				onValueChange={(value) => changeView(value as RankingView)}
			>
				<TabsList
					variant="line"
					aria-label="Ladder standings"
					className={styles.rankingTabsList}
				>
					<TabsTrigger
						value="current"
						className={styles.rankingTab}
						onPointerEnter={() => prefetchView("current")}
						onFocus={() => prefetchView("current")}
					>
						Standings
					</TabsTrigger>
					<TabsTrigger
						value="form"
						className={styles.rankingTab}
						onPointerEnter={() => prefetchView("form")}
						onFocus={() => prefetchView("form")}
					>
						Form
					</TabsTrigger>
					<TabsTrigger
						value="all-time"
						className={styles.rankingTab}
						onPointerEnter={() => prefetchView("all-time")}
						onFocus={() => prefetchView("all-time")}
					>
						All-time
					</TabsTrigger>
				</TabsList>
			</Tabs>

			<div className={styles.rankingFilters}>
				<DropdownMenu
					onOpenChange={(open) => {
						if (open) prefetchSeasons();
					}}
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="min-w-44 justify-between"
							aria-label={`Season: ${selectedSeason.label}, ${selectedSeason.status}`}
							onPointerEnter={prefetchSeasons}
							onFocus={prefetchSeasons}
						>
							<span className="flex items-center gap-2">
								<span>{selectedSeason.label}</span>
								<span className="text-muted-foreground text-xs">
									{selectedSeason.status}
								</span>
							</span>
							<ChevronDown data-icon="inline-end" aria-hidden="true" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-72">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Season</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={optimisticSeason}
								onValueChange={changeSeason}
							>
								{seasons.map((item) => (
									<DropdownMenuRadioItem key={item.id} value={item.id}>
										<span className="flex flex-1 items-center justify-between gap-4">
											<span>{item.label}</span>
											<span className="text-muted-foreground text-xs">
												{item.status}
											</span>
										</span>
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu
					onOpenChange={(open) => {
						if (open) prefetchLenses();
					}}
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="min-w-36 justify-between"
							aria-label={`Ranking lens: ${selectedLens.shortName}`}
							onPointerEnter={prefetchLenses}
							onFocus={prefetchLenses}
						>
							{selectedLens.shortName}
							<ChevronDown data-icon="inline-end" aria-hidden="true" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-52">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Ranking lens</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={optimisticLens}
								onValueChange={changeLens}
							>
								{Object.values(rankingLenses).map((lens) => (
									<DropdownMenuRadioItem key={lens.id} value={lens.id}>
										{lens.shortName}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<span className="sr-only" aria-live="polite">
				{isPending ? "Updating ranking" : "Ranking updated"}
			</span>
		</div>
	);
}
