"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { getCountryCode } from "@/lib/country-codes";
import { cn } from "@/lib/utils";
import type { UserSearchMetadata } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { QueryResult } from "@upstash/vector";
import {
	ArrowUp,
	Loader2,
	Mic,
	MicOff,
	Plus,
	Search,
	Sparkle,
	User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CountryFlag } from "../ui/CountryFlag";

// Función para obtener el código de país para la bandera
type SuggestedQuery = {
	id: string;
	text: string;
};

// Define a type for query suggestions
type QuerySuggestion = {
	id: string;
	score: number;
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

	// Debounce search input to avoid too many API calls
	const debouncedSearchTerm = useDebounce(query, 300);

	// Use React Query for search via the API route
	const {
		data: searchData,
		isLoading: isSearching,
		error: searchError,
	} = useQuery({
		queryKey: ["userSearch", debouncedSearchTerm],
		queryFn: async () => {
			if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
				return { results: [] };
			}

			// Use the API route instead of direct function call
			const response = await fetch(
				`/api/search?query=${encodeURIComponent(debouncedSearchTerm)}&limit=8`,
			);

			if (!response.ok) {
				throw new Error("Failed to search users");
			}

			return response.json();
		},
		enabled: debouncedSearchTerm.length >= 2,
		staleTime: 1000 * 60 * 5, // 5 minutes
		retry: false,
	});

	console.log({
		searchData,
	});

	// Extract search results from the API response
	const getThreshold = (queryLength: number): number => {
		if (queryLength < 10) return 0.8;
		if (queryLength < 20) return 0.85;
		if (queryLength < 25) return 0.9;
		return 0.95;
	};

	// Apply dynamic threshold based on query length
	const dynamicThreshold = getThreshold(query.length);

	// Filter and separate user results and query suggestions
	const searchResults: QueryResult<UserSearchMetadata>[] =
		query.length > 60
			? [] // Force empty results for very long queries
			: searchData?.results?.filter(
					(result: QueryResult<UserSearchMetadata>) =>
						result.score >= dynamicThreshold && result.metadata,
				) || [];

	// Deduplicate users with the same username (keeping the higher score)
	const uniqueUserResults = searchResults.reduce<
		QueryResult<UserSearchMetadata>[]
	>((unique, current) => {
		// Skip results without username
		if (!current.metadata?.username) return unique;

		// Check if we already have a user with this username
		const existingIndex = unique.findIndex(
			(item) => item.metadata?.username === current.metadata?.username,
		);

		// If we don't have this username yet, add it
		if (existingIndex === -1) {
			unique.push(current);
		}
		// If we have this username but current result has a higher score, replace it
		else if (current.score > (unique[existingIndex].score || 0)) {
			unique[existingIndex] = current;
		}

		return unique;
	}, []);

	// Extract query suggestions (items without metadata)
	const queryResults: QueryResult<QuerySuggestion>[] =
		query.length > 60
			? []
			: searchData?.results?.filter(
					(result: QueryResult<unknown>) =>
						result.score >= dynamicThreshold &&
						!result.metadata &&
						typeof result.id === "string" &&
						result.id.startsWith("query:"),
				) || [];

	// Function to extract query text from ID
	const extractQueryText = (id: string | number): string => {
		if (typeof id !== "string" || !id.startsWith("query:")) return "";
		return id.substring("query:".length);
	};

	// Check if query is too long (over 30 chars)
	const isQueryTooLong = query.length > 30;

	const isCompact = variant === "compact";

	//---- Transcription ------

	const [error, setError] = useState<string | null>(null);

	const { isRecording, isProcessing, startRecording, stopRecording } =
		useSpeechToText({
			onResult: (text) => setQuery(text),
			onError: setError,
		});

	//---- Transcription END ------

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
					{
						id: "query-8",
						text: "DevOps engineers with Kubernetes expertise",
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

	// Helper function to highlight matched terms in text
	const highlightMatches = (text: string, searchTerm: string) => {
		if (!text || !searchTerm.trim()) return text || "";

		const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

		if (searchTerms.length === 0) return text;

		// Create a regex that matches any of the search terms
		const regex = new RegExp(`(${searchTerms.join("|")})`, "gi");

		// Split the text by the regex
		const parts = text.split(regex);

		// Generate unique keys that don't rely on array index alone
		return parts.map((part, i) => {
			// Check if this part matches any search term
			const isMatch = searchTerms.some(
				(term) => part?.toLowerCase() === term?.toLowerCase(),
			);

			// Create a unique key for this part based on its content and position
			const uniqueKey = `${text}-${part}-${i}`;

			return isMatch ? (
				<mark
					key={uniqueKey}
					className="rounded-sm bg-[#E6E7A4] px-0.5 text-black"
				>
					{part}
				</mark>
			) : (
				part
			);
		});
	};

	const handleUserClick = (username: string) => {
		router.push(`/developer/${username}`);
		setOpen(false);
	};

	// Check if we have any search error
	const hasSearchError = Boolean(searchError);

	// Check if we have results below threshold
	const hasLowQualityResults =
		(searchData?.results?.length > 0 &&
			uniqueUserResults.length === 0 &&
			queryResults.length === 0) ||
		isQueryTooLong;

	// Find highest score from each result type to determine display order
	const highestUserScore =
		uniqueUserResults.length > 0
			? Math.max(...uniqueUserResults.map((r) => r.score || 0))
			: 0;

	const highestQueryScore =
		queryResults.length > 0
			? Math.max(...queryResults.map((r) => r.score || 0))
			: 0;

	// Determine which block should be shown first
	const showQueriesFirst = highestQueryScore > highestUserScore;

	// Check for exact matches
	const isExactMatch = (text: string): boolean => {
		if (!text || !query) return false;
		return text.toLowerCase() === query.toLowerCase();
	};

	const handleQueryClick = (queryText: string) => {
		setQuery(queryText);
		setIsLoading(true);
		const slugifiedQuery = slugifyQuery(queryText);
		router.push(`/search/${slugifiedQuery}`);
		setOpen(false);
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
									placeholder={"Search developers..."}
									className="!shadow-none h-8 flex-1 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
									value={
										isRecording
											? "Recording audio..."
											: isProcessing
												? "Processing audio..."
												: query
									}
									onChange={handleInputChange}
									onKeyDown={handleInputKeyDown}
									disabled={isLoading || isProcessing || isRecording}
									onClick={handleInputClick}
								/>
							</>
						) : (
							<Textarea
								ref={textAreaRef}
								placeholder={
									"Search for developers, e.g., 'nextjs developers in Lima with >50 stars'"
								}
								className={cn(
									"!bg-transparent !shadow-none min-h-[52px] w-full resize-none border-0 p-2 pb-10 text-sm [field-sizing:content] focus-visible:ring-0 md:text-base",
								)}
								onChange={handleInputChange}
								onKeyDown={handleInputKeyDown}
								value={
									isRecording
										? "Recording audio..."
										: isProcessing
											? "Processing audio..."
											: query
								}
								disabled={isLoading || isProcessing || isRecording}
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
								onClick={isRecording ? stopRecording : startRecording}
								disabled={isLoading || isProcessing}
								aria-pressed={isRecording}
							>
								{isRecording ? (
									<MicOff
										className={cn(isCompact ? "h-3.5 w-3.5" : "h-4 w-4")}
									/>
								) : (
									<Mic className={cn(isCompact ? "h-3.5 w-3.5" : "h-4 w-4")} />
								)}
								<span className="sr-only">
									Voice Search –{" "}
									{isRecording ? "Stop recording" : "Start recording"}
								</span>
							</Button>
							<Button
								size="icon"
								className={cn(
									"rounded-full bg-primary text-primary-foreground",
									isCompact ? "h-7 w-7" : "h-8 w-8",
								)}
								onClick={handleSearch}
								disabled={isLoading || isProcessing}
							>
								{isLoading || isProcessing ? (
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
					className="z-[999] rounded-t-none border-t-0 p-2 shadow-md"
					align="start"
					sideOffset={0}
				>
					<div className="flex flex-col items-stretch">
						{/* Query suggestions based on search - new section */}
						{isSearching ? (
							<div className="py-0.5">
								{Array.from({ length: 8 }).map((_, index) => (
									<div
										key={`skeleton-item-${index}-${debouncedSearchTerm}`}
										className="flex items-center rounded-lg px-2 py-[7.5px]"
									>
										{/* Avatar skeleton */}
										<Skeleton className="mr-3 size-6 rounded-full" />

										{/* User info skeleton */}
										<div className="flex flex-1 items-center gap-2">
											<div className="flex w-full flex-col gap-1">
												<div className="flex items-center gap-1">
													<Skeleton className="h-4 w-24" />
													<Skeleton className="h-4 w-2" />
													<Skeleton className="h-4 w-40" />
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : hasSearchError ? (
							<div className="px-2 py-3 text-center text-red-500 text-sm">
								Error searching users. Please try again.
								<div className="mt-1 border-border border-t pt-2" />
							</div>
						) : (
							<>
								{/* Conditionally order content based on scores */}
								{showQueriesFirst ? (
									<>
										{/* Query suggestions */}
										{queryResults.length > 0 && (
											<div>
												{queryResults.map((result) => {
													const queryText = extractQueryText(result.id);
													const isExact = isExactMatch(queryText);
													return (
														<button
															type="button"
															key={result.id || `query-${queryText}`}
															className="group flex w-full cursor-pointer flex-row items-center rounded-lg p-[8px] text-left hover:bg-muted"
															onClick={() => handleQueryClick(queryText)}
															aria-label={`Search for ${queryText}`}
														>
															<div className="flex w-full min-w-0 flex-row items-center whitespace-pre leading-tight">
																<span className="-mr-[3px] flex items-center text-textOff dark:text-textOffDark">
																	<Search className="mr-4 h-5 w-5 flex-shrink-0" />
																</span>
																<div className="truncate text-textMain dark:text-textMainDark">
																	<span className="text-sm text-textOff dark:text-textOffDark">
																		{highlightMatches(queryText, query)}
																	</span>
																</div>
																{isExact && (
																	<div className="ml-2 flex items-center">
																		<span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
																			<Sparkle className="h-3 w-3" />
																			Exact match
																		</span>
																	</div>
																)}
															</div>
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
														</button>
													);
												})}

												{/* Divider if we have both query results and user results */}
												{uniqueUserResults.length > 0 && (
													<div className="my-2 border-border border-t" />
												)}
											</div>
										)}

										{/* User search results */}
										{uniqueUserResults.length > 0 && (
											<div>
												{uniqueUserResults.map((result) => {
													const isUsernameExact = isExactMatch(
														result.metadata?.username || "",
													);
													const isFullnameExact = isExactMatch(
														result.metadata?.fullname || "",
													);
													return (
														<button
															type="button"
															key={`user-${result.id || result.metadata?.username}`}
															className="group flex w-full cursor-pointer flex-row items-center rounded-lg px-2 py-[7.7px] text-left hover:bg-muted"
															onClick={() =>
																handleUserClick(result.metadata?.username || "")
															}
														>
															{/* Avatar section */}
															<div className="mr-3 size-6 flex-shrink-0 overflow-hidden rounded-full">
																{result.metadata?.avatarUrl ? (
																	<Image
																		src={result.metadata.avatarUrl}
																		alt={result.metadata.username}
																		width={32}
																		height={32}
																		className="h-full w-full object-cover"
																	/>
																) : (
																	<div className="flex h-full w-full items-center justify-center bg-muted">
																		<User className="h-4 w-4 text-muted-foreground" />
																	</div>
																)}
															</div>

															{/* User info section */}
															<div className="flex flex-1 flex-row items-center gap-2 overflow-hidden">
																<div className="flex min-w-0 flex-1 items-center gap-0.5">
																	<div className="font-medium text-sm">
																		{highlightMatches(
																			result.metadata?.username || "",
																			query,
																		)}
																	</div>
																	{isUsernameExact && (
																		<div className="ml-1 flex items-center">
																			<span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
																				<Sparkle className="h-3 w-3" />
																				Exact
																			</span>
																		</div>
																	)}
																	<span className="text-muted-foreground">
																		{}&middot;
																	</span>
																	<div className="truncate text-muted-foreground text-sm">
																		{highlightMatches(
																			result.metadata?.fullname || "",
																			query,
																		)}
																	</div>
																	{isFullnameExact && (
																		<div className="ml-1 flex items-center">
																			<span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
																				<Sparkle className="h-3 w-3" />
																				Exact
																			</span>
																		</div>
																	)}
																	{result.metadata?.country && (
																		<>
																			<span className="text-muted-foreground">
																				{}&middot;
																			</span>
																			<div className="group relative flex items-center">
																				<CountryFlag
																					countryCode={
																						getCountryCode(
																							result.metadata.country,
																						) || "us"
																					}
																					size="sm"
																				/>
																			</div>
																		</>
																	)}
																</div>
																{/* Meta info (match type) */}
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
															</div>
														</button>
													);
												})}
											</div>
										)}
									</>
								) : (
									<>
										{/* User search results */}
										{uniqueUserResults.length > 0 && (
											<div>
												{uniqueUserResults.map((result) => {
													const isUsernameExact = isExactMatch(
														result.metadata?.username || "",
													);
													const isFullnameExact = isExactMatch(
														result.metadata?.fullname || "",
													);
													return (
														<button
															type="button"
															key={`user-${result.id || result.metadata?.username}`}
															className="group flex w-full cursor-pointer flex-row items-center rounded-lg px-2 py-[7.7px] text-left hover:bg-muted"
															onClick={() =>
																handleUserClick(result.metadata?.username || "")
															}
														>
															{/* Avatar section */}
															<div className="mr-3 size-6 flex-shrink-0 overflow-hidden rounded-full">
																{result.metadata?.avatarUrl ? (
																	<Image
																		src={result.metadata.avatarUrl}
																		alt={result.metadata.username}
																		width={32}
																		height={32}
																		className="h-full w-full object-cover"
																	/>
																) : (
																	<div className="flex h-full w-full items-center justify-center bg-muted">
																		<User className="h-4 w-4 text-muted-foreground" />
																	</div>
																)}
															</div>

															{/* User info section */}
															<div className="flex flex-1 flex-row items-center gap-2 overflow-hidden">
																<div className="flex min-w-0 flex-1 items-center gap-0.5">
																	<div className="font-medium text-sm">
																		{highlightMatches(
																			result.metadata?.username || "",
																			query,
																		)}
																	</div>
																	{isUsernameExact && (
																		<div className="ml-1 flex items-center">
																			<span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
																				<Sparkle className="h-3 w-3" />
																				Exact
																			</span>
																		</div>
																	)}
																	<span className="text-muted-foreground">
																		{}&middot;
																	</span>
																	<div className="truncate text-muted-foreground text-sm">
																		{highlightMatches(
																			result.metadata?.fullname || "",
																			query,
																		)}
																	</div>
																	{isFullnameExact && (
																		<div className="ml-1 flex items-center">
																			<span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
																				<Sparkle className="h-3 w-3" />
																				Exact
																			</span>
																		</div>
																	)}
																	{result.metadata?.country && (
																		<>
																			<span className="text-muted-foreground">
																				{}&middot;
																			</span>
																			<div className="group relative flex items-center">
																				<CountryFlag
																					countryCode={
																						getCountryCode(
																							result.metadata.country,
																						) || "us"
																					}
																					size="sm"
																				/>
																			</div>
																		</>
																	)}
																</div>
																{/* Meta info (match type) */}
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
															</div>
														</button>
													);
												})}

												{/* Divider if we have both query results and user results */}
												{queryResults.length > 0 && (
													<div className="my-2 border-border border-t" />
												)}
											</div>
										)}

										{/* Query suggestions */}
										{queryResults.length > 0 && (
											<div>
												{queryResults.map((result) => {
													const queryText = extractQueryText(result.id);
													const isExact = isExactMatch(queryText);
													return (
														<button
															type="button"
															key={result.id || `query-${queryText}`}
															className="group flex w-full cursor-pointer flex-row items-center rounded-lg p-[8px] text-left hover:bg-muted"
															onClick={() => handleQueryClick(queryText)}
															aria-label={`Search for ${queryText}`}
														>
															<div className="flex w-full min-w-0 flex-row items-center whitespace-pre leading-tight">
																<span className="-mr-[3px] flex items-center text-textOff dark:text-textOffDark">
																	<Search className="mr-4 h-5 w-5 flex-shrink-0" />
																</span>
																<div className="truncate text-textMain dark:text-textMainDark">
																	<span className="text-sm text-textOff dark:text-textOffDark">
																		{highlightMatches(queryText, query)}
																	</span>
																</div>
																{isExact && (
																	<div className="ml-2 flex items-center">
																		<span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
																			<Sparkle className="h-3 w-3" />
																			Exact match
																		</span>
																	</div>
																)}
															</div>
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
														</button>
													);
												})}
											</div>
										)}
									</>
								)}
							</>
						)}

						{/* No results state */}
						{query.length > 1 &&
							!isSearching &&
							debouncedSearchTerm &&
							uniqueUserResults.length === 0 &&
							queryResults.length === 0 && (
								<div className="px-2 py-3 text-muted-foreground text-sm">
									{hasLowQualityResults ? (
										<div className="flex flex-col items-center justify-center space-y-4 py-8">
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
												<Search className="h-6 w-6 text-muted-foreground/70" />
											</div>
											<p className="text-center font-medium">
												{isQueryTooLong
													? "Query is too long. Please be more specific"
													: "No good matches found for your search"}
											</p>
											<Button
												variant="outline"
												className="flex w-full max-w-xs cursor-pointer items-center gap-2 border-dashed transition-colors hover:bg-muted/50"
												onClick={() => setOpen(false)}
											>
												<Plus className="h-4 w-4" />
												<span>Index this developer</span>
												<span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary text-xs">
													PRO
												</span>
											</Button>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center space-y-4 py-8">
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
												<Search className="h-6 w-6 text-muted-foreground/70" />
											</div>
											<p className="text-center font-medium">
												No matching users found
											</p>
										</div>
									)}
									{!query && (
										<div className="mt-1 border-border border-t pt-2" />
									)}
								</div>
							)}

						{/* Suggested queries - only show when no query is entered */}
						{debouncedSearchTerm.length === 0 &&
							suggestedQueries.length > 0 && (
								<div>
									{suggestedQueries.map((suggestedQuery) => (
										<button
											type="button"
											key={suggestedQuery.id}
											className="group flex w-full cursor-pointer flex-row items-center rounded-lg p-[8px] text-left hover:bg-muted"
											onClick={() =>
												handleSuggestedQueryClick(suggestedQuery.text)
											}
											aria-label={`Search for ${suggestedQuery.text}`}
										>
											<div className="flex w-full min-w-0 flex-row items-center whitespace-pre leading-tight">
												<span className="-mr-[3px] flex items-center text-textOff dark:text-textOffDark">
													<Search className="mr-4 h-5 w-5 flex-shrink-0" />
												</span>
												<div className="truncate text-textMain dark:text-textMainDark">
													<span className="text-sm text-textOff dark:text-textOffDark">
														{suggestedQuery.text}
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
							)}
					</div>
				</PopoverContent>
			</Popover>
			{error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
		</div>
	);
}
