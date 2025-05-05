"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2, Mic, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SuggestedQuery = {
	id: string;
	text: string;
};

interface SearchBoxProps {
	initialQuery?: string;
	variant?: "full" | "compact";
}

export function SearchBox({
	initialQuery = "",
	variant = "full",
}: SearchBoxProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState(initialQuery);
	const [isLoading, setIsLoading] = useState(false);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const isCompact = variant === "compact";

	const suggestedQueries: SuggestedQuery[] = [
		{
			id: "query-1",
			text: "AI engineers in Lima",
		},
		{
			id: "query-2",
			text: "Python data science experts in Berlin",
		},
		{
			id: "query-3",
			text: "React developers with over 100 stars",
		},
		{
			id: "query-4",
			text: "Rust developers who contribute to open source",
		},
		...(isCompact
			? []
			: [
					{
						id: "query-5",
						text: "Full-stack developers in San Francisco",
					},
					{
						id: "query-6",
						text: "Backend developers with microservices experience",
					},
					{
						id: "query-7",
						text: "Mobile developers skilled in React Native",
					},
				]),
	];

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setQuery(e.target.value);
	};

	const slugifyQuery = (text: string) => {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_-]+/g, "-")
			.replace(/^-+|-+$/g, "");
	};

	const handleSearch = (e?: React.MouseEvent) => {
		if (e) e.stopPropagation();
		if (!query.trim()) return;

		setIsLoading(true);
		const slugifiedQuery = slugifyQuery(query);
		router.push(`/search/${slugifiedQuery}`);
		setOpen(false);
	};

	const handleInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		// Solo manejamos Enter para búsqueda
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSearch();
		}
	};

	const handleSuggestedQueryClick = (queryText: string) => {
		setQuery(queryText);
		setIsLoading(true);
		const slugifiedQuery = slugifyQuery(queryText);
		router.push(`/search/${slugifiedQuery}`);
		setOpen(false);
	};

	// Forzar la apertura del popover al hacer clic en el input/textarea
	const handleInputClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!open) {
			setOpen(true);
		}
	};

	useEffect(() => {
		if (open) {
			setTimeout(() => {
				if (isCompact) {
					inputRef.current?.focus();
				} else {
					textAreaRef.current?.focus();
				}
			}, 0);
		}
	}, [open, isCompact]);

	const handleTriggerClick = (e: React.MouseEvent<HTMLDivElement>) => {
		// No abrir el popover si hacemos clic directamente en un botón o en el campo de entrada
		if (
			e.target instanceof HTMLButtonElement ||
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement
		) {
			return;
		}
		setOpen(true);
	};

	const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Ignorar eventos de teclado que vienen de campos de entrada
		if (
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement
		) {
			return;
		}

		// Solo activamos el popover con Enter o Space en el contenedor
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setOpen(true);
		}
	};

	return (
		<div
			className={cn(
				"w-full",
				!isCompact && "max-w-3xl rounded-lg bg-background",
				open && "rounded-b-none",
			)}
		>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div
						ref={triggerRef}
						className={cn(
							"relative flex w-full border border-border bg-input/30 text-left shadow-sm",
							isCompact
								? "items-center rounded-lg px-3 py-1.5"
								: "items-end rounded-lg p-2",
							open && "rounded-b-none",
							isLoading && "opacity-75",
						)}
						onClick={handleTriggerClick}
						onKeyDown={handleTriggerKeyDown}
						aria-haspopup="true"
						// biome-ignore lint/a11y/useSemanticElements: <explanation>
						role="button"
						tabIndex={0}
					>
						{isCompact ? (
							<>
								<Search className="mr-2 h-4 w-4 text-muted-foreground" />
								<Input
									ref={inputRef}
									type="text"
									placeholder="Search developers..."
									className="!shadow-none h-8 flex-1 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
									value={query}
									onChange={handleInputChange}
									onKeyDown={handleInputKeyDown}
									disabled={isLoading}
									onClick={handleInputClick}
								/>
							</>
						) : (
							<Textarea
								ref={textAreaRef}
								placeholder="Search for developers, e.g., 'nextjs developers in Lima with >50 stars'"
								className={cn(
									"!bg-transparent !shadow-none min-h-[52px] w-full resize-none border-0 p-2 pb-10 text-sm [field-sizing:content] focus-visible:ring-0 md:text-base",
								)}
								onChange={handleInputChange}
								onKeyDown={handleInputKeyDown}
								value={query}
								disabled={isLoading}
								onClick={handleInputClick}
							/>
						)}

						<div
							className={cn(
								"flex items-center gap-1.5",
								isCompact ? "" : "absolute right-4 bottom-2",
							)}
						>
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									"rounded-full text-muted-foreground",
									isCompact ? "h-7 w-7" : "h-8 w-8",
								)}
								onClick={(e) => e.stopPropagation()}
								disabled={isLoading}
							>
								<Mic className={cn(isCompact ? "h-3.5 w-3.5" : "h-4 w-4")} />
								<span className="sr-only">Voice search</span>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									"hidden rounded-full text-muted-foreground hover:text-primary md:block",
									isCompact ? "h-7 w-7" : "mr-1 h-8 w-8",
								)}
								onClick={(e) => e.stopPropagation()}
								disabled={isLoading}
							>
								<Sparkles
									className={cn(isCompact ? "h-3.5 w-3.5" : "h-4 w-4")}
								/>
								<span className="sr-only">Enhance prompt</span>
							</Button>

							<Button
								size="icon"
								className={cn(
									"rounded-full bg-primary text-primary-foreground",
									isCompact ? "h-7 w-7" : "h-8 w-8",
								)}
								onClick={handleSearch}
								disabled={isLoading}
							>
								{isLoading ? (
									<Loader2
										className={cn(
											"animate-spin",
											isCompact ? "h-3.5 w-3.5" : "h-4 w-4",
										)}
									/>
								) : (
									<ArrowUp
										className={cn(isCompact ? "h-3.5 w-3.5" : "h-4 w-4")}
									/>
								)}
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
							<button
								type="button"
								key={query.id}
								className="group flex w-full cursor-pointer flex-row items-center rounded-lg bg-background-100 p-[8px] text-left hover:bg-background-200 dark:bg-background-200 dark:hover:bg-background-300"
								onClick={() => handleSuggestedQueryClick(query.text)}
								aria-label={`Search for ${query.text}`}
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
								{!isCompact && (
									<div className="ml-auto pr-xs text-super opacity-0 group-hover:opacity-100 dark:text-superDark">
										<div className="appearance-none">
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
										</div>
									</div>
								)}
							</button>
						))}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
