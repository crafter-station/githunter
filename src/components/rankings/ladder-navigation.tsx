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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { rankingLenses } from "@/rankings/lenses";
import { type RankingView, rankingFilterParsers } from "@/rankings/query-state";
import type { LensId, RankingSeason } from "@/rankings/types";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useEffect, useState, useTransition } from "react";

function rankingHref(changes: {
	scope: string;
	view?: RankingView;
	lens?: LensId;
	season?: string | null;
}) {
	const params = new URLSearchParams(window.location.search);
	for (const [key, value] of Object.entries(changes)) {
		if (key === "scope") continue;
		if (value === null || value === "current" || value === "balanced") {
			params.delete(key);
		} else if (value) {
			params.set(key, value);
		}
	}
	const view = params.get("view") ?? "current";
	if (view === "form" || view === "all-time") params.delete("season");
	const query = params.toString();
	return query ? `/${changes.scope}?${query}` : `/${changes.scope}`;
}

export function LadderNavigation({
	active,
	season,
	seasons,
	lensId,
	scope,
}: {
	active: "current" | "form" | "all-time" | "season";
	season: RankingSeason;
	seasons: RankingSeason[];
	lensId: LensId;
	scope: string;
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
	const isSeasonal =
		optimisticView === "current" || optimisticView === "season";
	const formAvailable = seasons.length > 1;
	const closedSeasons = seasons.filter(
		(item) => item.status === "closed",
	).length;
	const allTimeAvailable = closedSeasons > 0;

	useEffect(() => setOptimisticView(active), [active]);
	useEffect(() => setOptimisticLens(lensId), [lensId]);
	useEffect(() => setOptimisticSeason(season.id), [season.id]);

	const prefetchView = (view: RankingView) => {
		router.prefetch(
			rankingHref({
				scope,
				view,
				season: view === "current" ? null : undefined,
			}),
		);
	};

	const prefetchLenses = () => {
		for (const lens of Object.values(rankingLenses)) {
			router.prefetch(rankingHref({ scope, lens: lens.id }));
		}
	};

	const prefetchSeasons = () => {
		for (const item of seasons) {
			router.prefetch(rankingHref({ scope, view: "season", season: item.id }));
		}
	};

	const changeView = (view: RankingView) => {
		if (!view) return;
		const nextView = view === "season" ? "current" : view;
		setOptimisticView(nextView);
		void setFilters({
			view: nextView,
			season: null,
		});
	};

	const changeSeason = (value: string) => {
		setOptimisticSeason(value);
		setOptimisticView("season");
		void setFilters({ view: "season", season: value });
	};

	const changeLens = (value: string) => {
		if (!value) return;
		const nextLens = value as LensId;
		setOptimisticLens(nextLens);
		void setFilters(
			isSeasonal
				? { lens: nextLens }
				: {
						lens: nextLens,
						season: null,
					},
		);
	};

	return (
		<div className={styles.rankingControls} aria-busy={isPending}>
			<div className={styles.lensControl}>
				<div className={styles.controlHeading}>
					<span>Ranking lens</span>
					<span>v{selectedLens.version}</span>
				</div>
				<ToggleGroup
					type="single"
					variant="outline"
					spacing={0}
					value={optimisticLens}
					onValueChange={changeLens}
					aria-label="Ranking lens"
					className={styles.lensToggleGroup}
					onPointerEnter={prefetchLenses}
					onFocus={prefetchLenses}
				>
					{Object.values(rankingLenses).map((lens) => (
						<ToggleGroupItem
							key={lens.id}
							value={lens.id}
							data-selected={optimisticLens === lens.id ? "true" : undefined}
							aria-label={lens.name}
							className={styles.lensToggle}
						>
							{lens.shortName}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>

			<div className={styles.timeControl}>
				<div className={styles.controlHeading}>
					<span>Time range</span>
				</div>
				<div className={styles.timeControlRow}>
					<ToggleGroup
						type="single"
						variant="outline"
						spacing={0}
						value={isSeasonal ? "season" : optimisticView}
						onValueChange={(value) => changeView(value as RankingView)}
						aria-label="Ranking time range"
						className={styles.timeToggleGroup}
					>
						<ToggleGroupItem
							value="season"
							data-selected={isSeasonal ? "true" : undefined}
							onPointerEnter={() => prefetchView("current")}
							onFocus={() => prefetchView("current")}
						>
							Season
						</ToggleGroupItem>
						<ToggleGroupItem
							value="form"
							data-selected={optimisticView === "form" ? "true" : undefined}
							disabled={!formAvailable}
							title={
								formAvailable
									? undefined
									: "Form needs at least two available seasons"
							}
							onPointerEnter={() => formAvailable && prefetchView("form")}
							onFocus={() => formAvailable && prefetchView("form")}
						>
							Form
						</ToggleGroupItem>
						<ToggleGroupItem
							value="all-time"
							data-selected={optimisticView === "all-time" ? "true" : undefined}
							disabled={!allTimeAvailable}
							title={
								allTimeAvailable
									? undefined
									: "All-time opens after the first official season closes"
							}
							onPointerEnter={() =>
								allTimeAvailable && prefetchView("all-time")
							}
							onFocus={() => allTimeAvailable && prefetchView("all-time")}
						>
							All-time
						</ToggleGroupItem>
					</ToggleGroup>

					{isSeasonal ? (
						<DropdownMenu
							onOpenChange={(open) => {
								if (open) prefetchSeasons();
							}}
						>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="min-w-44 justify-between"
									aria-label={`Season: ${selectedSeason.label}, ${selectedSeason.status}`}
									onPointerEnter={prefetchSeasons}
									onFocus={prefetchSeasons}
								>
									<span className="flex items-center gap-2">
										<span className="whitespace-nowrap">
											{selectedSeason.label}
										</span>
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
					) : null}
				</div>
			</div>
			<span className="sr-only" aria-live="polite">
				{isPending ? "Updating ranking" : "Ranking updated"}
			</span>
		</div>
	);
}
