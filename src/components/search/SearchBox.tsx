"use client";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUp, Mic, Search, Sparkles } from "lucide-react";
import { useState } from "react";

type SuggestedQuery = {
	id: string;
	text: string;
};

export function SearchBox() {
	const [open, setOpen] = useState(false);

	const suggestedQueries: SuggestedQuery[] = [
		{ id: "query-1", text: "nextjs developers in Lima with >100 stars" },
		{ id: "query-2", text: "python devs who contribute to tensorflow" },
		{
			id: "query-3",
			text: "golang engineers in Argentina with >10 public repos",
		},
		{
			id: "query-4",
			text: "frontend devs open to work with shadcn experience",
		},
		{ id: "query-5", text: "typescript devs building devtools" },
		{
			id: "query-6",
			text: "react developers with +50 contributions this year",
		},
		{ id: "query-7", text: "devs contributing to bun or deno" },
	];

	return (
		<div
			className={cn(
				"w-full max-w-3xl rounded-lg bg-background",
				open && "rounded-b-none",
			)}
		>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div
						className={cn(
							"relative flex items-end rounded-lg border border-border bg-input/30 p-2 shadow-sm",
							open && "rounded-b-none",
						)}
					>
						<Textarea
							placeholder="Search for developers, e.g., 'nextjs developers in Lima with >50 stars'"
							className="!bg-transparent !shadow-none min-h-[52px] w-full resize-none border-0 p-2 pb-10 [field-sizing:content] focus-visible:ring-0"
						/>
						<div className="absolute right-4 bottom-2 flex items-center gap-1.5">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-full text-muted-foreground"
							>
								<Mic className="h-4 w-4" />
								<span className="sr-only">Voice search</span>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="mr-1 h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
							>
								<Sparkles className="h-4 w-4" />
								<span className="sr-only">Enhance prompt</span>
							</Button>
							<Button
								size="icon"
								className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
							>
								<ArrowUp className="h-4 w-4" />
								<span className="sr-only">Search</span>
							</Button>
						</div>
					</div>
				</PopoverTrigger>
				<PopoverContent
					className="rounded-t-none border-t-0 p-2 shadow-md"
					align="start"
					sideOffset={0}
				>
					<div className="flex flex-col items-stretch">
						{suggestedQueries.map((query) => (
							<div
								key={query.id}
								className="group flex cursor-pointer flex-row items-center rounded-lg bg-background-100 p-[8px] hover:bg-background-200 dark:bg-background-200 dark:hover:bg-background-300"
							>
								<div className="flex w-full min-w-0 flex-row items-center whitespace-pre leading-tight">
									<span className="-mr-[3px] flex items-center text-textOff dark:text-textOffDark">
										<Search className="mr-4 h-5 w-5 flex-shrink-0" />
									</span>
									<div className="truncate text-textMain dark:text-textMainDark">
										<span className="text-sm text-textOff dark:text-textOffDark">
											{query.text}
										</span>
									</div>
								</div>
								<div className="ml-auto pr-xs text-super opacity-0 group-hover:opacity-100 dark:text-superDark">
									<button className="appearance-none" type="button">
										<svg
											aria-hidden="true"
											focusable="false"
											className="h-4 w-4"
											role="img"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 384 512"
										>
											<path
												fill="currentColor"
												d="M56 96c-13.3 0-24 10.7-24 24l0 240c0 13.3 10.7 24 24 24s24-10.7 24-24l0-182.1L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-231-231L296 144c13.3 0 24-10.7 24-24s-10.7-24-24-24L56 96z"
											/>
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
