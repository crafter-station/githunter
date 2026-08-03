import { cn } from "@/lib/utils";

const podium = {
	1: {
		label: "gold",
		className: "border-[#d6a64c]/55 bg-[#d6a64c]/12 text-[#f0c66f]",
	},
	2: {
		label: "silver",
		className: "border-[#aeb8c4]/55 bg-[#aeb8c4]/10 text-[#d5dce4]",
	},
	3: {
		label: "bronze",
		className: "border-[#b86f3e]/55 bg-[#b86f3e]/12 text-[#dc9a6c]",
	},
} as const;

export function RankBadge({ rank }: { rank: number }) {
	const position = podium[rank as keyof typeof podium];
	if (!position) {
		return <strong className="tabular-nums">#{rank}</strong>;
	}
	return (
		<strong
			aria-label={`Rank ${rank}, ${position.label}`}
			className={cn(
				"inline-flex min-w-10 items-center justify-center rounded-md border px-2 py-1 font-mono text-xs tabular-nums",
				position.className,
			)}
		>
			#{rank}
		</strong>
	);
}

export function podiumRowClass(rank: number) {
	if (rank === 1) return "bg-[#d6a64c]/[0.035]";
	if (rank === 2) return "bg-[#aeb8c4]/[0.025]";
	if (rank === 3) return "bg-[#b86f3e]/[0.03]";
	return undefined;
}
