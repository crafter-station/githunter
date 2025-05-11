"use client";

import { CombinedDevMetricsRadar } from "@/components/combined-dev-metrics-radar";
import { DevMetricsRadar } from "@/components/dev-metrics-radar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Search, Star, UserPlus, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Maximum number of developers that can be compared
const MAX_DEVELOPERS = 6;

// Base chart colors
const CHART_COLORS = [
	"hsl(220, 70%, 65%)", // Softer Blue
	"hsl(10, 70%, 65%)", // Softer Red
	"hsl(130, 70%, 65%)", // Softer Green
	"hsl(40, 70%, 65%)", // Softer Amber
	"hsl(280, 70%, 65%)", // Softer Purple
	"hsl(170, 70%, 65%)", // Softer Teal
];

interface Developer {
	id: string;
	username: string;
	fullname: string;
	avatarUrl: string;
	color: string;
	metrics: {
		followers: number;
		stars: number;
		repositories: number;
		issues?: number;
		pullRequests?: number;
		commits?: number;
	};
}

// Custom compact developer component
function DeveloperItem({
	developer,
	onRemove,
}: {
	developer: Developer;
	onRemove: () => void;
}) {
	return (
		<div
			className="group relative overflow-hidden rounded-md border border-border/50 transition-colors hover:bg-muted/20"
			style={{
				backgroundColor: `${developer.color}20`,
				borderLeft: `3px solid ${developer.color}`,
			}}
		>
			<Link
				href={`/developer/${developer.username}`}
				className="flex items-center gap-3 p-2"
			>
				<div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border/50">
					<Image
						src={developer.avatarUrl}
						alt={`${developer.fullname}'s profile picture`}
						width={48}
						height={48}
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between">
						<h3 className="truncate font-medium text-sm">
							{developer.fullname || developer.username}
						</h3>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1 text-xs">
								<Star className="h-3 w-3 text-amber-500" />
								<span>{developer.metrics.stars}</span>
							</div>
						</div>
					</div>
					<div className="mt-1 flex items-center gap-2">
						<p className="truncate text-muted-foreground text-xs">
							@{developer.username}
						</p>
					</div>
					<div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs">
						<span className="flex items-center gap-1">
							<Code2 className="h-3 w-3 text-blue-500" />
							{developer.metrics.repositories}
						</span>
						<span className="flex items-center gap-1">
							<Users className="h-3 w-3 text-green-500" />
							{developer.metrics.followers}
						</span>
					</div>
				</div>
			</Link>
			<Button
				onClick={onRemove}
				size="sm"
				variant="ghost"
				className="-right-1 -top-1 absolute h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<X className="h-3 w-3" />
				<span className="sr-only">Remove {developer.fullname}</span>
			</Button>
		</div>
	);
}

// Developer card with full metrics and radar chart
function DeveloperCard({
	developer,
	onRemove,
}: {
	developer: Developer;
	onRemove: () => void;
}) {
	return (
		<div
			className="group relative overflow-hidden rounded-lg border border-border/50 bg-card"
			style={{ borderLeftWidth: "3px", borderLeftColor: developer.color }}
		>
			<div className="p-4">
				{/* Header with avatar and name */}
				<div className="mb-3 flex items-start gap-3">
					<div className="h-12 w-12 overflow-hidden rounded-full border border-border/50">
						<Image
							src={developer.avatarUrl}
							alt={`${developer.fullname}'s profile`}
							width={48}
							height={48}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className="min-w-0 flex-1">
						<h3
							className="truncate font-medium text-base"
							style={{ color: developer.color }}
						>
							{developer.fullname}
						</h3>
						<p className="truncate text-muted-foreground text-xs">
							@{developer.username}
						</p>
					</div>
				</div>

				{/* Metrics */}
				<div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
					<div className="flex items-center gap-1.5">
						<Star className="h-3.5 w-3.5 text-amber-500" />
						<span>{developer.metrics.stars.toLocaleString()} stars</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Code2 className="h-3.5 w-3.5 text-blue-500" />
						<span>{developer.metrics.repositories.toLocaleString()} repos</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Users className="h-3.5 w-3.5 text-green-500" />
						<span>
							{developer.metrics.followers.toLocaleString()} followers
						</span>
					</div>
				</div>

				{/* Radar chart */}
				<div className="mt-3 h-[260px]">
					<DevMetricsRadar developer={developer} />
				</div>
			</div>

			{/* Remove button */}
			<Button
				onClick={onRemove}
				size="sm"
				variant="outline"
				className="absolute top-2 right-2 h-7 w-7 rounded-full border-muted-foreground/30 bg-background/80 p-0 opacity-0 backdrop-blur-sm transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100"
			>
				<X className="h-3.5 w-3.5" />
				<span className="sr-only">Remove {developer.fullname}</span>
			</Button>
		</div>
	);
}

export default function CompareMetricsPlayground({
	users,
}: { users: string | undefined }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedDevelopers, setSelectedDevelopers] = useState<Developer[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// On initial load, check URL for usernames to compare
	useEffect(() => {
		async function loadDevelopersFromUrl() {
			try {
				if (!users) {
					setIsLoading(false);
					return;
				}

				const usernames = users.split(",").filter(Boolean);
				// users is an array of usernames
				if (usernames.length === 0) {
					setIsLoading(false);
					return;
				}

				// Fetch data for each developer in parallel
				const promises = usernames.map((username) => fetchUserData(username));
				const developers = await Promise.all(promises);
				console.log({ developers });

				// Filter out any null results (developers not found)
				const validDevelopers = developers.filter(Boolean) as Developer[];

				// Assign colors
				validDevelopers.forEach((dev, index) => {
					dev.color = CHART_COLORS[index % CHART_COLORS.length];
				});

				setSelectedDevelopers(validDevelopers);
			} catch (err) {
				console.error("Error loading developers from URL:", err);
				setError("Failed to load developers from URL parameters");
			} finally {
				setIsLoading(false);
			}
		}

		loadDevelopersFromUrl();
	}, [users]);

	// Add a developer to the comparison
	const addDeveloper = async () => {
		if (!searchQuery.trim()) return;
		if (selectedDevelopers.length >= MAX_DEVELOPERS) {
			setError(
				`Maximum of ${MAX_DEVELOPERS} developers allowed for comparison`,
			);
			return;
		}

		// Check if developer is already in the list
		if (
			selectedDevelopers.some(
				(dev) => dev.username.toLowerCase() === searchQuery.toLowerCase(),
			)
		) {
			setError("This developer is already in your comparison");
			return;
		}

		setIsSearching(true);
		setError(null);

		try {
			const userData = await fetchUserData(searchQuery);

			if (!userData) {
				setError(
					"Developer not found. Please check the username and try again.",
				);
				return;
			}

			// Assign a color from our color palette
			const colorIndex = selectedDevelopers.length % CHART_COLORS.length;
			userData.color = CHART_COLORS[colorIndex];

			setSelectedDevelopers([...selectedDevelopers, userData]);
			setSearchQuery("");
		} catch (err) {
			setError("An error occurred while fetching developer data");
			console.error(err);
		} finally {
			setIsSearching(false);
		}
	};

	// Remove a developer from the comparison
	const removeDeveloper = (username: string) => {
		setSelectedDevelopers(
			selectedDevelopers.filter((dev) => dev.username !== username),
		);
	};

	// Update the URL with selected developers (for sharing)
	const updateUrlWithDevelopers = useCallback(() => {
		if (selectedDevelopers.length > 0) {
			const usernames = selectedDevelopers.map((dev) => dev.username).join(",");
			router.push(`/compare?users=${usernames}`, { scroll: false });
		} else {
			router.push("/compare", { scroll: false });
		}
	}, [selectedDevelopers, router]);

	// Update URL when selected developers change
	useEffect(() => {
		updateUrlWithDevelopers();
	}, [updateUrlWithDevelopers]);

	// Fetch developer data from the API
	const fetchUserData = async (username: string): Promise<Developer | null> => {
		try {
			const response = await fetch(`/api/developers/${username}`);

			if (!response.ok) {
				if (response.status === 404) {
					return null;
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("Error fetching developer data:", error);
			throw error;
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-muted-foreground">Loading developer data...</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			{/* Left Column - Developer Input & List */}
			<div className="space-y-4 md:col-span-1">
				<Card className="md:sticky md:top-20">
					<CardContent className="pt-0">
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="mb-5 flex gap-2">
							<div className="flex-1">
								<Label
									htmlFor="username-search"
									className="mb-1.5 block font-medium text-sm"
								>
									Add GitHub Developer
								</Label>
								<div className="relative">
									<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										id="username-search"
										placeholder="Enter GitHub username..."
										className="pl-9"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyDown={(e) => e.key === "Enter" && addDeveloper()}
										disabled={
											isSearching || selectedDevelopers.length >= MAX_DEVELOPERS
										}
									/>
								</div>
							</div>
							<div className="flex items-end">
								<Button
									onClick={addDeveloper}
									disabled={
										isSearching ||
										!searchQuery.trim() ||
										selectedDevelopers.length >= MAX_DEVELOPERS
									}
								>
									<UserPlus className="mr-1 h-4 w-4" />
									Add
								</Button>
							</div>
						</div>

						<div className="mt-6">
							<h3 className="mb-3 font-medium text-muted-foreground text-sm">
								Selected Developers ({selectedDevelopers.length}/
								{MAX_DEVELOPERS})
							</h3>

							<div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
								{selectedDevelopers.length === 0 ? (
									<div className="py-6 text-center text-muted-foreground text-sm">
										Add developers to compare
									</div>
								) : (
									selectedDevelopers.map((dev) => (
										<DeveloperItem
											key={dev.username}
											developer={dev}
											onRemove={() => removeDeveloper(dev.username)}
										/>
									))
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Right Column - Chart */}
			<div className="h-full md:col-span-2">
				<Card>
					<CardContent className="pt-0 pb-6.5">
						<div className="mb-4">
							<Tabs defaultValue="combined" className="w-full">
								<TabsList className="mb-4">
									<TabsTrigger value="combined">Combined View</TabsTrigger>
									<TabsTrigger value="individual">Individual View</TabsTrigger>
								</TabsList>
								<TabsContent value="combined" className="pt-4">
									<CombinedDevMetricsRadar developers={selectedDevelopers} />
								</TabsContent>
								<TabsContent value="individual" className="pt-4">
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
										{selectedDevelopers.map((developer) => (
											<DeveloperCard
												key={developer.username}
												developer={developer}
												onRemove={() => removeDeveloper(developer.username)}
											/>
										))}
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
