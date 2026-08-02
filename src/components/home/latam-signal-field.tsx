"use client";

import styles from "@/app/home.module.css";
import { cn } from "@/lib/utils";
import type { SignalProfile } from "@/rankings/signals";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";

const COLUMNS = 27;
const ROWS = 22;

const cells = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
	const column = index % COLUMNS;
	const row = Math.floor(index / COLUMNS);
	const x = column / (COLUMNS - 1);
	const y = row / (ROWS - 1);
	const left = ((x - 0.32) / 0.3) ** 2 + ((y - 0.48) / 0.48) ** 2;
	const right = ((x - 0.74) / 0.27) ** 2 + ((y - 0.5) / 0.46) ** 2;
	const waist = ((x - 0.53) / 0.22) ** 2 + ((y - 0.53) / 0.22) ** 2;
	const hash = (column * 31 + row * 17 + column * row * 7) % 29;
	const visible =
		(left < 1.02 || right < 1.02 || waist < 1) &&
		!(x > 0.46 && x < 0.59 && y < 0.35) &&
		hash > 3;
	const tone = hash % 13 === 0 ? "accent" : hash % 9 === 0 ? "solid" : "line";

	return { column, index, row, tone, visible, x, y };
}).filter((cell) => cell.visible);

const slotTargets = [
	[0.3, 0.2],
	[0.54, 0.22],
	[0.75, 0.24],
	[0.2, 0.38],
	[0.42, 0.4],
	[0.68, 0.42],
	[0.82, 0.44],
	[0.25, 0.58],
	[0.48, 0.58],
	[0.7, 0.62],
	[0.32, 0.76],
	[0.62, 0.78],
] as const;

const profileSlots = slotTargets.map(([targetX, targetY]) =>
	cells.reduce((closest, cell) => {
		const distance = (cell.x - targetX) ** 2 + (cell.y - targetY) ** 2;
		const closestDistance =
			(closest.x - targetX) ** 2 + (closest.y - targetY) ** 2;
		return distance < closestDistance ? cell : closest;
	}),
);

export function LatamSignalField({
	className,
	profiles,
}: {
	className?: string;
	profiles: SignalProfile[];
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const availableProfiles = profiles.slice(0, profileSlots.length);
	const activeProfile = availableProfiles[activeIndex] ?? availableProfiles[0];
	const activeSlot = profileSlots[activeIndex] ?? profileSlots[0];
	const focusX = 1 + (activeSlot.column / (COLUMNS - 1)) * 98;
	const focusY = 7 + (activeSlot.row / (ROWS - 1)) * 88;
	const profileByCell = new Map(
		availableProfiles.map((profile, index) => [
			profileSlots[index].index,
			{ profile, profileIndex: index },
		]),
	);

	return (
		<fieldset
			className={cn(styles.field, className)}
			style={
				{
					"--focus-x": `${focusX}%`,
					"--focus-y": `${focusY}%`,
				} as CSSProperties
			}
		>
			<legend className="sr-only">Explore public GitHub profiles</legend>
			{activeProfile && (
				<div className={styles.fieldCoordinates}>
					@{activeProfile.login} · #{activeProfile.rank}
				</div>
			)}
			<div className={styles.cellGrid}>
				{cells.map((cell) => {
					const node = profileByCell.get(cell.index);
					const cellStyle = {
						gridColumn: cell.column + 1,
						gridRow: cell.row + 1,
					};
					if (!node) {
						return (
							<span
								key={cell.index}
								className={styles.cell}
								data-tone={cell.tone}
								style={cellStyle}
								aria-hidden="true"
							/>
						);
					}
					return (
						<button
							key={cell.index}
							type="button"
							className={cn(styles.cell, styles.profileCell)}
							data-tone="accent"
							data-selected={node.profileIndex === activeIndex}
							style={cellStyle}
							onPointerEnter={() => setActiveIndex(node.profileIndex)}
							onFocus={() => setActiveIndex(node.profileIndex)}
							onClick={() => setActiveIndex(node.profileIndex)}
							aria-label={`Select ${node.profile.name}, ranked ${node.profile.rank}`}
							aria-pressed={node.profileIndex === activeIndex}
						/>
					);
				})}
			</div>
			<div className={styles.axisX} aria-hidden="true" />
			<div className={styles.axisY} aria-hidden="true" />
			<div className={styles.focusRing} aria-hidden="true">
				<span />
			</div>
			<div className={styles.focusNode} aria-hidden="true" />
			{activeProfile && (
				<div
					className={styles.fieldDetail}
					data-side={focusX > 60 ? "left" : "right"}
					aria-live="polite"
				>
					<div className={styles.detailIdentity}>
						<Image
							src={activeProfile.avatarUrl}
							alt=""
							width={42}
							height={42}
							className={styles.detailAvatar}
						/>
						<div>
							<strong>{activeProfile.name}</strong>
							<span>@{activeProfile.login}</span>
						</div>
					</div>
					<div className={styles.detailStats}>
						<span>#{activeProfile.rank} Balanced</span>
						<span>
							{activeProfile.strongestLabel} {activeProfile.strongestValue}
						</span>
						<span>{activeProfile.score.toFixed(2)} score</span>
					</div>
					<Link
						href={`/developer/${activeProfile.login}`}
						className={styles.detailLink}
					>
						Open profile <ArrowUpRight aria-hidden="true" />
					</Link>
				</div>
			)}
		</fieldset>
	);
}
