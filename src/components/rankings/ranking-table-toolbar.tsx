import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function RankingTableToolbar({
	id,
	status,
	meta,
	title,
	description,
	query,
	placeholder,
	onQueryChange,
}: {
	id: string;
	status: string;
	meta: string;
	title: string;
	description: string;
	query: string;
	placeholder: string;
	onQueryChange: (value: string) => void;
}) {
	return (
		<CardHeader className="gap-3 border-b-[1px] px-4 py-3 md:grid-cols-[minmax(0,1fr)_18rem] md:grid-rows-[auto] md:items-center">
			<div className="flex min-w-0 items-center gap-2">
				<CardTitle id={`${id}-title`} className="sr-only">
					{title}
				</CardTitle>
				<CardDescription className="sr-only">{description}</CardDescription>
				<Badge variant="outline">{status}</Badge>
				<span className="truncate text-muted-foreground text-xs">{meta}</span>
			</div>
			<label htmlFor={id} className="w-full">
				<span className="sr-only">Search developers</span>
				<Input
					id={id}
					value={query}
					onChange={(event) => onQueryChange(event.target.value)}
					placeholder={placeholder}
				/>
			</label>
		</CardHeader>
	);
}
