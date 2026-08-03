"use client";

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
import { rankingCountryHref } from "@/rankings/query-state";
import {
	type RankingScope,
	isRankingScope,
	rankingScopes,
} from "@/rankings/scopes";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CountrySwitcher({ scope }: { scope?: RankingScope }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const segment = pathname.split("/").filter(Boolean)[0];
	const current = scope ?? (isRankingScope(segment) ? segment : "peru");

	const changeCountry = (scope: string) => {
		router.push(rankingCountryHref(scope, searchParams.toString()));
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="gap-2"
					aria-label={`Country: ${rankingScopes[current].name}`}
				>
					{rankingScopes[current].name}
					<ChevronDown data-icon="inline-end" aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="max-h-[70vh] w-52 overflow-y-auto"
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Country ranking</DropdownMenuLabel>
					<DropdownMenuRadioGroup value={current} onValueChange={changeCountry}>
						{Object.entries(rankingScopes).map(([scope, item]) => (
							<DropdownMenuRadioItem key={scope} value={scope}>
								{item.name}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
