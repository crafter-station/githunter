import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function RankingHeroStats({
	items,
}: {
	items: Array<{ label: string; value: string }>;
}) {
	return (
		<div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
			{items.map((item) => (
				<Card key={item.label} className="gap-2 py-4 shadow-none">
					<CardHeader className="px-4">
						<CardDescription>{item.label}</CardDescription>
						<CardTitle>{item.value}</CardTitle>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
