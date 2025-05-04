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
import { useEffect, useRef, useState } from "react";

type SuggestedQuery = {
	id: string;
	text: string;
};

export function SearchBox() {
	const [open, setOpen] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);

	const suggestedQueries: SuggestedQuery[] = [
		{
			id: "query-1",
			text: "Elon Musk's Starbase, Texas becomes an official city",
		},
		{
			id: "query-2",
			text: "Houthi missile hits Ben Gurion Airport disrupting flights",
		},
		{
			id: "query-3",
			text: "Voters overwhelmingly approve creation of SpaceX's Starbase city in Texas",
		},
		{
			id: "query-4",
			text: "Musk denies Nazi comparisons in new interview amid criticism and protests",
		},
		{
			id: "query-5",
			text: "Small plane crashes into Simi Valley homes pilot killed",
		},
		{
			id: "query-6",
			text: "Derelict ferry Queen of Sidney catches fire in Mission BC",
		},
		{
			id: "query-7",
			text: "India recalls IMF Executive Director Krishnamurthy Subramanian",
		},
	];

	// Efecto para establecer el foco cuando el popover se abre
	useEffect(() => {
		if (open) {
			setTimeout(() => {
				textareaRef.current?.focus();
			}, 0);
		}
	}, [open]);

	const handleTriggerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		// Evitar que los clics en los botones disparen el manejador del trigger
		if (e.target instanceof HTMLButtonElement) {
			e.stopPropagation();
			return;
		}
		setOpen(true);
	};

	const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
		// Evitar que el clic en el textarea dispare el manejador del trigger
		e.stopPropagation();
		setOpen(true);
	};

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
						ref={triggerRef}
						className={cn(
							"relative flex items-end rounded-lg border border-border bg-input/30 p-2 shadow-sm",
							open && "rounded-b-none",
						)}
						onClick={handleTriggerClick}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								setOpen(true);
							}
						}}
					>
						<Textarea
							ref={textareaRef}
							placeholder="Search for developers, e.g., 'nextjs developers in Lima with >50 stars'"
							className="!bg-transparent !shadow-none min-h-[52px] w-full resize-none border-0 p-2 pb-10 text-sm [field-sizing:content] focus-visible:ring-0 md:text-base"
							onClick={handleTextareaClick}
						/>
						<div className="absolute right-4 bottom-2 flex items-center gap-1.5">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-full text-muted-foreground"
								onClick={(e) => e.stopPropagation()} // Evitar que el clic en el botón dispare el trigger
							>
								<Mic className="h-4 w-4" />
								<span className="sr-only">Voice search</span>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="mr-1 h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
								onClick={(e) => e.stopPropagation()} // Evitar que el clic en el botón dispare el trigger
							>
								<Sparkles className="h-4 w-4" />
								<span className="sr-only">Enhance prompt</span>
							</Button>
							<Button
								size="icon"
								className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
								onClick={(e) => e.stopPropagation()} // Evitar que el clic en el botón dispare el trigger
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
