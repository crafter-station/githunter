"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import {
	ArrowLeft,
	ChevronDown,
	ChevronUp,
	Loader2,
	Lock,
	Plus,
	Search,
	Sparkles,
	Telescope,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import React, { useState } from "react";

interface Technology {
	name: string;
	importance: number;
}

export default function AdvancedSearchPage() {
	const router = useRouter();
	const { currentPlan } = useSubscription();
	const isPro = React.useMemo(
		() => currentPlan?.name === "Pro" || currentPlan?.name === "Plus",
		[currentPlan],
	);
	// Convert jobDescription to nuqs state
	const [jobDescription, setJobDescription] = useQueryState("job", {
		defaultValue: "",
		shallow: true,
		history: "replace",
	});

	// Convert technologies to nuqs state
	const [technologiesJson, setTechnologiesJson] = useQueryState("tech", {
		defaultValue: "[]",
		shallow: true,
		history: "replace",
		parse: (value) => {
			try {
				return value ? JSON.parse(value) : [];
			} catch (e) {
				return [];
			}
		},
		serialize: (value) => JSON.stringify(value),
	});

	const technologies: Technology[] =
		typeof technologiesJson === "string"
			? JSON.parse(technologiesJson)
			: technologiesJson;

	// Convert location to nuqs state
	const [city, setCity] = useQueryState("city", {
		defaultValue: "",
		shallow: true,
		history: "replace",
	});
	const [country, setCountry] = useQueryState("country", {
		defaultValue: "",
		shallow: true,
		history: "replace",
	});

	// Keep UI state with useState
	const [newTech, setNewTech] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);

	const handleAddTechnology = () => {
		if (newTech.trim()) {
			// Check if tech already exists
			if (
				technologies.some(
					(tech) => tech.name.toLowerCase() === newTech.toLowerCase(),
				)
			) {
				return;
			}

			const newTechnologies = [
				...technologies,
				{ name: newTech.trim(), importance: 50 },
			];
			setTechnologiesJson(newTechnologies);
			setNewTech("");
		}
	};

	const handleRemoveTechnology = (index: number) => {
		const newTechnologies = technologies.filter((_, i) => i !== index);
		setTechnologiesJson(newTechnologies);
	};

	const handleImportanceChange = (index: number, value: number[]) => {
		const newTechnologies = [...technologies];
		newTechnologies[index].importance = value[0];
		setTechnologiesJson(newTechnologies);
	};

	const extractTechStack = async () => {
		if (!jobDescription.trim()) {
			setError("Please enter a job description");
			return;
		}

		if (!isPro) {
			setError("PRO subscription required to use this feature");
			return;
		}

		try {
			setError(null);
			setIsAnalyzing(true);

			const response = await fetch("/api/extract-tech-stack", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					jobDescription,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to analyze job description");
			}

			const data = await response.json();

			if (data.object.technologies && Array.isArray(data.object.technologies)) {
				// Sort by importance (highest first)
				const sortedTechs = [...data.object.technologies].sort(
					(a, b) => b.importance - a.importance,
				);
				setTechnologiesJson(sortedTechs);

				// Set location if extracted
				if (data.object.city) setCity(data.object.city);
				if (data.object.country) setCountry(data.object.country);
			} else {
				console.error("Invalid response format:", data);
				setError("Received invalid data format from server");
			}
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to analyze job description. Please try again.",
			);
			console.error(err);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleSearch = () => {
		if (technologies.length === 0) {
			setError("Please add at least one technology");
			return;
		}

		// Filter technologies with importance > 0
		const relevantTechs = technologies
			.filter((tech) => tech.importance > 0)
			.map((tech) => `${tech.name}-${tech.importance}`)
			.join("-");

		// Build the search URL
		let searchPath = `/search/advanced/${relevantTechs}`;

		// Add location if provided
		const location = [city, country].filter(Boolean).join("-");
		if (location) {
			searchPath = `${searchPath}/in/${location}`;
		}

		// Add job description as a query parameter if it exists
		if (jobDescription) {
			const descriptionParam = encodeURIComponent(jobDescription);
			searchPath = `${searchPath}?description=${descriptionParam}`;
		}

		router.push(searchPath);
	};

	// Add toggle function for description collapse
	const toggleDescription = () => {
		setIsDescriptionCollapsed(!isDescriptionCollapsed);
	};

	// Render extract button based on PRO status
	const renderExtractButton = () => {
		if (isAnalyzing) {
			return (
				<Button type="button" disabled className="w-full" size="lg">
					<Loader2 className="mr-2 h-5 w-5 animate-spin" />
					Analyzing...
				</Button>
			);
		}

		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="w-full">
							<Button
								type="button"
								onClick={extractTechStack}
								disabled={!jobDescription.trim() || !isPro}
								className="w-full"
								size="lg"
							>
								{isPro ? (
									<>
										<Sparkles className="mr-2 h-5 w-5" />
										Extract Tech Stack
									</>
								) : (
									<>
										<Lock className="mr-2 h-5 w-5" />
										PRO Feature - Extract Tech Stack
									</>
								)}
							</Button>
						</div>
					</TooltipTrigger>
					{!isPro && (
						<TooltipContent>
							<p>This feature requires a PRO subscription.</p>
							<Link
								href="/pricing"
								className="mt-1 block text-center text-blue-500 text-xs hover:underline"
							>
								Upgrade to PRO
							</Link>
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		);
	};

	return (
		<div className="flex min-h-screen flex-col">
			<Header noSearch />

			<main className="flex flex-1 flex-col items-center justify-center py-12">
				<div className="w-full max-w-2xl px-4">
					{/* Page Header */}
					<div className="mb-8 text-center">
						<div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
							<Telescope className="h-6 w-6" />
						</div>
						<h1 className="font-semibold text-2xl tracking-tight">
							Advanced Developer Search
						</h1>
						<p className="mt-2 text-muted-foreground text-sm">
							Paste a job description to automatically extract technologies, or
							manually set your requirements.
						</p>
					</div>

					<div className="space-y-6">
						{/* Job Description Section */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Label
										htmlFor="job-description"
										className="font-medium text-base"
									>
										Job Description
									</Label>
									{!isPro && (
										<Badge
											variant="outline"
											className="gap-1 border-yellow-600 text-yellow-600"
										>
											<Lock className="h-3 w-3" />
											PRO
										</Badge>
									)}
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={toggleDescription}
									className="h-8 w-8 p-0"
								>
									{isDescriptionCollapsed ? (
										<ChevronDown className="h-4 w-4" />
									) : (
										<ChevronUp className="h-4 w-4" />
									)}
									<span className="sr-only">
										{isDescriptionCollapsed ? "Expand" : "Collapse"} job
										description
									</span>
								</Button>
							</div>

							{!isDescriptionCollapsed && (
								<div className="relative rounded-md border border-input bg-background transition-colors focus-within:ring-1 focus-within:ring-ring">
									<Textarea
										id="job-description"
										placeholder="Paste a job description or LinkedIn job post..."
										className="min-h-[200px] resize-y border-0 bg-transparent focus-visible:ring-0"
										value={jobDescription}
										onChange={(e) => setJobDescription(e.target.value)}
									/>
								</div>
							)}

							{isDescriptionCollapsed && jobDescription && (
								<div className="rounded-md bg-muted/30 p-3 text-muted-foreground text-sm italic">
									<div className="line-clamp-2">{jobDescription}</div>
									<div className="mt-1 text-center text-xs">
										{jobDescription.length} characters
									</div>
								</div>
							)}

							{renderExtractButton()}
							{error && <p className="text-destructive text-sm">{error}</p>}
						</div>

						{/* Technologies Section */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label className="font-medium text-base">Technologies</Label>
								<span className="text-muted-foreground text-sm">
									{technologies.length} technologies
								</span>
							</div>

							{/* Add technology manually */}
							<div className="flex gap-2">
								<div className="relative flex-1 rounded-md border border-input bg-background transition-colors focus-within:ring-1 focus-within:ring-ring">
									<Input
										placeholder="Add technology..."
										value={newTech}
										onChange={(e) => setNewTech(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddTechnology();
											}
										}}
										className="border-0 bg-transparent focus-visible:ring-0"
									/>
								</div>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={handleAddTechnology}
									disabled={!newTech.trim()}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{/* Technology list with sliders */}
							<div
								className={cn(
									"space-y-3",
									technologies.length > 5 &&
										"max-h-[400px] overflow-y-auto pr-2",
								)}
							>
								{technologies.length === 0 ? (
									<div className="py-8 text-center">
										<p className="text-muted-foreground text-sm">
											No technologies added yet. Paste a job description and
											click "Extract Tech Stack" or add them manually.
										</p>
									</div>
								) : (
									technologies.map((tech, index) => (
										<div
											key={`${tech.name}-${index}`}
											className="space-y-3 rounded-md border border-input bg-background p-4"
										>
											<div className="flex items-center justify-between">
												<span className="font-medium text-sm">{tech.name}</span>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="h-7 w-7"
													onClick={() => handleRemoveTechnology(index)}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground text-xs">
														Importance
													</span>
													<span className="font-medium text-xs">
														{tech.importance}%
													</span>
												</div>
												<Slider
													value={[tech.importance]}
													onValueChange={(value) =>
														handleImportanceChange(index, value)
													}
													max={100}
													step={1}
												/>
											</div>
										</div>
									))
								)}
							</div>
						</div>

						{/* Location Section */}
						<div className="space-y-4">
							<Label className="font-medium text-base">
								Location (Optional)
							</Label>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="city" className="text-sm">
										City
									</Label>
									<div className="relative rounded-md border border-input bg-background transition-colors focus-within:ring-1 focus-within:ring-ring">
										<Input
											id="city"
											placeholder="Enter city..."
											value={city}
											onChange={(e) => setCity(e.target.value)}
											className="border-0 bg-transparent focus-visible:ring-0"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="country" className="text-sm">
										Country
									</Label>
									<div className="relative rounded-md border border-input bg-background transition-colors focus-within:ring-1 focus-within:ring-ring">
										<Input
											id="country"
											placeholder="Enter country..."
											value={country}
											onChange={(e) => setCountry(e.target.value)}
											className="border-0 bg-transparent focus-visible:ring-0"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
							<Button
								variant="outline"
								onClick={() => router.back()}
								size="lg"
								className="w-full sm:w-auto"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Cancel
							</Button>
							<Button
								onClick={handleSearch}
								disabled={technologies.length === 0}
								size="lg"
								className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
							>
								<Search className="mr-2 h-5 w-5" />
								Search Developers
							</Button>
						</div>
					</div>

					{/* Return link */}
					<div className="mt-8 text-center text-muted-foreground text-xs">
						<Link
							href="/"
							className="inline-flex items-center hover:text-primary hover:underline"
						>
							<ArrowLeft className="mr-1 h-3 w-3" />
							Return to developer search
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
