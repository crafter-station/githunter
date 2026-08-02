"use client";

import styles from "@/app/home.module.css";
import { cn } from "@/lib/utils";
import type { CSSProperties, PointerEvent } from "react";
import { useRef } from "react";

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

	return { column, index, row, tone, visible };
}).filter((cell) => cell.visible);

export function LatamSignalField({ className }: { className?: string }) {
	const fieldRef = useRef<HTMLDivElement>(null);

	const moveFocus = (event: PointerEvent<HTMLDivElement>) => {
		const field = fieldRef.current;
		if (!field) return;
		const bounds = field.getBoundingClientRect();
		const x = Math.min(
			82,
			Math.max(18, ((event.clientX - bounds.left) / bounds.width) * 100),
		);
		const y = Math.min(
			82,
			Math.max(18, ((event.clientY - bounds.top) / bounds.height) * 100),
		);
		field.style.setProperty("--focus-x", `${x}%`);
		field.style.setProperty("--focus-y", `${y}%`);
	};

	return (
		<div
			ref={fieldRef}
			className={cn(styles.field, className)}
			onPointerMove={moveFocus}
			style={{ "--focus-x": "56%", "--focus-y": "52%" } as CSSProperties}
			aria-hidden="true"
		>
			<div className={styles.fieldCoordinates}>-12.0464, -77.0428</div>
			<div className={styles.cellGrid}>
				{cells.map((cell) => (
					<span
						key={cell.index}
						className={styles.cell}
						data-tone={cell.tone}
						style={{
							gridColumn: cell.column + 1,
							gridRow: cell.row + 1,
						}}
					/>
				))}
			</div>
			<div className={styles.axisX} />
			<div className={styles.axisY} />
			<div className={styles.focusRing}>
				<span />
			</div>
			<div className={styles.focusNode} />
			<div className={styles.fieldDetail}>
				<span className={styles.detailMark} />
				<div>
					<strong>Public node</strong>
					<span>Open data · Peru / 01</span>
				</div>
			</div>
		</div>
	);
}
