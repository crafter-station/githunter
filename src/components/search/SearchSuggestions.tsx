import { Button } from "@/components/ui/button";

interface SearchSuggestionsProps {
	suggestions: string[];
}

export function SearchSuggestions({ suggestions }: SearchSuggestionsProps) {
	return (
		<div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
			<span>Try searching:</span>
			<div className="flex flex-wrap justify-center gap-2">
				{suggestions.map((suggestion) => (
					<Button
						key={suggestion}
						variant="outline"
						size="sm"
						className="h-8 rounded-full border-border bg-background hover:bg-muted"
					>
						{suggestion}
					</Button>
				))}
			</div>
		</div>
	);
}
