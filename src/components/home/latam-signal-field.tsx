"use client";

import styles from "@/app/home.module.css";
import { cn } from "@/lib/utils";
import type { SignalProfile } from "@/rankings/signals";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

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
	const [focusGeometry, setFocusGeometry] = useState<{
		x: number;
		y: number;
		size: number;
		fieldWidth: number;
	} | null>(null);
	const fieldRef = useRef<HTMLFieldSetElement>(null);
	const profileRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const profileCenters = useRef<Array<{ x: number; y: number } | null>>([]);
	const availableProfiles = profiles.slice(0, profileSlots.length);
	const activeProfile = availableProfiles[activeIndex] ?? availableProfiles[0];
	const profileByCell = new Map(
		availableProfiles.map((profile, index) => [
			profileSlots[index].index,
			{ profile, profileIndex: index },
		]),
	);
	const updateFocusGeometry = useCallback(() => {
		const field = fieldRef.current;
		const activeNode = profileRefs.current[activeIndex];
		if (!field || !activeNode) return;
		const fieldRect = field.getBoundingClientRect();
		const nodeRect = activeNode.getBoundingClientRect();
		profileCenters.current = profileRefs.current.map((node) => {
			if (!node) return null;
			const rect = node.getBoundingClientRect();
			return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
		});
		setFocusGeometry({
			x: nodeRect.left - fieldRect.left + nodeRect.width / 2,
			y: nodeRect.top - fieldRect.top + nodeRect.height / 2,
			size: nodeRect.width,
			fieldWidth: fieldRect.width,
		});
	}, [activeIndex]);

	useLayoutEffect(() => {
		updateFocusGeometry();
		const field = fieldRef.current;
		const activeNode = profileRefs.current[activeIndex];
		if (!field || !activeNode) return;
		const observer = new ResizeObserver(updateFocusGeometry);
		observer.observe(field);
		observer.observe(activeNode);
		return () => observer.disconnect();
	}, [activeIndex, updateFocusGeometry]);

	const handlePointerMove = (event: ReactPointerEvent<HTMLFieldSetElement>) => {
		if (event.pointerType !== "mouse") return;
		if (event.target instanceof Element && event.target.closest("a")) return;
		let nearestIndex = activeIndex;
		let nearestDistance = Number.POSITIVE_INFINITY;
		for (const [index, center] of profileCenters.current.entries()) {
			if (!center) continue;
			const distance =
				(center.x - event.clientX) ** 2 + (center.y - event.clientY) ** 2;
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestIndex = index;
			}
		}
		if (nearestIndex !== activeIndex) setActiveIndex(nearestIndex);
	};

	const detailSide =
		focusGeometry && focusGeometry.x > focusGeometry.fieldWidth * 0.62
			? "left"
			: "right";

	return (
		<fieldset
			ref={fieldRef}
			className={cn(styles.field, className)}
			onPointerMove={handlePointerMove}
			data-signal-field
			style={
				focusGeometry
					? ({
							"--focus-x": `${focusGeometry.x}px`,
							"--focus-y": `${focusGeometry.y}px`,
							"--focus-size": `${focusGeometry.size}px`,
						} as CSSProperties)
					: undefined
			}
		>
			<legend className="sr-only">Explore public GitHub profiles</legend>
			{activeProfile && (
				<div
					className={styles.fieldCoordinates}
					data-side={detailSide}
					data-coordinate-label
				>
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
							ref={(element) => {
								profileRefs.current[node.profileIndex] = element;
							}}
							key={cell.index}
							type="button"
							className={cn(styles.cell, styles.profileCell)}
							data-tone="accent"
							data-selected={node.profileIndex === activeIndex}
							data-profile-login={node.profile.login}
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
			<div className={styles.focusNode} data-focus-node aria-hidden="true" />
			{activeProfile && (
				<div
					className={styles.fieldDetail}
					data-side={detailSide}
					data-profile-card
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
