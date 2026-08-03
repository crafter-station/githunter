import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";

export function RankingHeroStats({
	items,
}: {
	items: Array<{ label: string; value: string }>;
}) {
	return (
		<dl className={styles.heroStats}>
			{items.map((item) => (
				<div key={item.label}>
					<dt>{item.label}</dt>
					<dd>{item.value}</dd>
				</div>
			))}
		</dl>
	);
}
