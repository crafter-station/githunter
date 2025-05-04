import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	ArrowUp,
	BarChart2,
	ChartNoAxesColumnIncreasing,
	FileText,
	GitFork,
	Mic,
	Search,
	Sparkles,
	Star,
	User,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			{/* Header */}
			<Header />

			{/* Hero Section - Full Viewport Height */}
			<section className="flex min-h-[100dvh] items-center justify-center">
				<div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16">
					<div className="flex flex-col items-center gap-4">
						<h1 className="max-w-3xl text-center font-light text-3xl md:text-4xl">
							What kind of{" "}
							<span className="font-medium">open-source developer</span> are you
							looking for?
						</h1>
						<p className="max-w-2xl text-center text-muted-foreground text-sm">
							Search. Discover. Connect with the right open-source talent.
						</p>
					</div>

					{/* Search - v0 style */}
					<div className="w-full max-w-3xl rounded-lg border border-border bg-background shadow-sm">
						<div className="relative flex items-end p-2">
							<div className="pointer-events-none absolute top-3 left-4 text-muted-foreground">
								<Search className="h-5 w-5" />
							</div>
							<Textarea
								placeholder="Search for developers, e.g., 'nextjs developers in Lima with >50 stars'"
								className="min-h-[52px] resize-none border-0 py-2 pr-24 pl-10 shadow-none [field-sizing:content] focus-visible:ring-0"
							/>
							<div className="absolute right-2 bottom-3 flex items-center gap-1.5">
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
									className="mr-2 h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
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
					</div>

					{/* Example Search Suggestions */}
					<div className="flex flex-col items-center gap-2 text-muted-foreground text-sm">
						<span>Try searching:</span>
						<div className="flex flex-wrap justify-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="h-8 rounded-full border-border bg-background hover:bg-muted"
							>
								react devs in Peru
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="h-8 rounded-full border-border bg-background hover:bg-muted"
							>
								nextjs engineers with &gt;200 stars
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="h-8 rounded-full border-border bg-background hover:bg-muted"
							>
								frontend developer São Paulo
							</Button>
						</div>
					</div>

					{/* Featured GitHub Profiles */}
					<div className="mt-8 w-full max-w-4xl">
						<h2 className="mb-6 text-center font-medium text-lg">
							Featured Profiles
						</h2>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
							{/* Profile Card - Jibaru */}
							<Card className="border-border bg-card p-5 transition-shadow hover:shadow-md">
								<div className="flex flex-col gap-4">
									<div className="flex gap-3">
										<div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-muted">
											<Image
												src="https://avatars.githubusercontent.com/u/54339832?v=4"
												alt="Jibaru"
												width={56}
												height={56}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 overflow-hidden">
											<div className="flex items-start justify-between">
												<div>
													<h3 className="truncate font-medium">Jibaru</h3>
													<p className="truncate text-muted-foreground text-xs">
														Ignacio Rueda
													</p>
													<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
														<span className="h-2 w-2 rounded-full bg-green-500" />{" "}
														Lima, Perú
													</p>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="-mt-1 -mr-1 h-6 w-6"
												>
													<ArrowUp className="h-3 w-3" />
												</Button>
											</div>
										</div>
									</div>
									<div className="flex justify-between text-muted-foreground text-xs">
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3" />
											<span>399</span>
										</div>
										<div className="flex items-center gap-1">
											<User className="h-3 w-3" />
											<span>36</span>
										</div>
										<div className="flex items-center gap-1">
											<GitFork className="h-3 w-3" />
											<span>109</span>
										</div>
										<div className="flex items-center gap-1">
											<ChartNoAxesColumnIncreasing className="h-3 w-3" />
											<span>1047+</span>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<h4 className="font-medium text-xs">Top Repository</h4>
										<div className="rounded-md bg-muted/50 p-2">
											<div className="flex items-center justify-between">
												<span className="text-xs">text0</span>
												<div className="flex items-center gap-1">
													<Star className="h-3 w-3" />
													<span className="text-xs">286</span>
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-wrap gap-1">
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											go
										</span>
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											typescript
										</span>
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											react
										</span>
									</div>
								</div>
							</Card>

							{/* Profile Card - cuevaio */}
							<Card className="border-border bg-card p-5 transition-shadow hover:shadow-md">
								<div className="flex flex-col gap-4">
									<div className="flex gap-3">
										<div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-muted">
											<Image
												src="https://avatars.githubusercontent.com/u/83598208?v=4"
												alt="cuevaio"
												width={56}
												height={56}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 overflow-hidden">
											<div className="flex items-start justify-between">
												<div>
													<h3 className="truncate font-medium">cuevaio</h3>
													<p className="truncate text-muted-foreground text-xs">
														Anthony Cueva
													</p>
													<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
														<span className="h-2 w-2 rounded-full bg-green-500" />{" "}
														Lima, Peru
													</p>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="-mt-1 -mr-1 h-6 w-6"
												>
													<ArrowUp className="h-3 w-3" />
												</Button>
											</div>
										</div>
									</div>
									<div className="flex justify-between text-muted-foreground text-xs">
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3" />
											<span>319</span>
										</div>
										<div className="flex items-center gap-1">
											<User className="h-3 w-3" />
											<span>29</span>
										</div>
										<div className="flex items-center gap-1">
											<GitFork className="h-3 w-3" />
											<span>73</span>
										</div>
										<div className="flex items-center gap-1">
											<ChartNoAxesColumnIncreasing className="h-3 w-3" />
											<span>322+</span>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<h4 className="font-medium text-xs">Top Repository</h4>
										<div className="rounded-md bg-muted/50 p-2">
											<div className="flex items-center justify-between">
												<span className="text-xs">text0</span>
												<div className="flex items-center gap-1">
													<Star className="h-3 w-3" />
													<span className="text-xs">286</span>
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-wrap gap-1">
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											react
										</span>
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											ai
										</span>
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											python
										</span>
									</div>
								</div>
							</Card>

							{/* Profile Card - Railly */}
							<Card className="border-border bg-card p-5 transition-shadow hover:shadow-md">
								<div className="flex flex-col gap-4">
									<div className="flex gap-3">
										<div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-muted">
											<Image
												src="https://avatars.githubusercontent.com/u/51397083?v=4"
												alt="Railly"
												width={56}
												height={56}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 overflow-hidden">
											<div className="flex items-start justify-between">
												<div>
													<h3 className="truncate font-medium">railly</h3>
													<p className="truncate text-muted-foreground text-xs">
														Railly Hugo
													</p>
													<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
														<span className="h-2 w-2 rounded-full bg-green-500" />{" "}
														Lima, Peru
													</p>
												</div>
												<Button
													variant="ghost"
													size="icon"
													className="-mt-1 -mr-1 h-6 w-6"
												>
													<ArrowUp className="h-3 w-3" />
												</Button>
											</div>
										</div>
									</div>
									<div className="flex justify-between text-muted-foreground text-xs">
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3" />
											<span>1477</span>
										</div>
										<div className="flex items-center gap-1">
											<User className="h-3 w-3" />
											<span>145</span>
										</div>
										<div className="flex items-center gap-1">
											<GitFork className="h-3 w-3" />
											<span>63</span>
										</div>
										<div className="flex items-center gap-1">
											<ChartNoAxesColumnIncreasing className="h-3 w-3" />
											<span>1000+</span>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<h4 className="font-medium text-xs">Top Repository</h4>
										<div className="rounded-md bg-muted/50 p-2">
											<div className="flex items-center justify-between">
												<span className="text-xs">tinte</span>
												<div className="flex items-center gap-1">
													<Star className="h-3 w-3" />
													<span className="text-xs">410</span>
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-wrap gap-1">
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											typescript
										</span>
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											nextjs
										</span>
										<span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
											design
										</span>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Feature Cards */}
			<section className="flex min-h-[100dvh] items-center justify-center border-border border-t border-dashed py-20">
				<div className="container mx-auto flex flex-col items-center px-4">
					<h2 className="mb-12 text-center font-medium text-2xl">
						Features Overview
					</h2>
					<div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
						<Card className="border-border bg-card p-5 transition-shadow hover:shadow-md">
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-2.5">
									<div className="rounded-full bg-primary/10 p-2.5">
										<Mic className="h-4 w-4 text-primary" />
									</div>
									<span className="font-medium">Voice Summaries</span>
								</div>
								<p className="pl-10 text-muted-foreground text-sm">
									Hear insights about developers with LLM + ElevenLabs voice
									synthesis
								</p>
							</div>
						</Card>

						<Card className="border-border bg-card p-5 transition-shadow hover:shadow-md">
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-2.5">
									<div className="rounded-full bg-primary/10 p-2.5">
										<BarChart2 className="h-4 w-4 text-primary" />
									</div>
									<span className="font-medium">Smart Alerts</span>
								</div>
								<p className="pl-10 text-muted-foreground text-sm">
									Get notifications when new developers match your search
									criteria
								</p>
							</div>
						</Card>

						<Card className="border-border bg-card p-5 transition-shadow hover:shadow-md">
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-2.5">
									<div className="rounded-full bg-primary/10 p-2.5">
										<FileText className="h-4 w-4 text-primary" />
									</div>
									<span className="font-medium">Stack Analysis</span>
								</div>
								<p className="pl-10 text-muted-foreground text-sm">
									Auto-detect skills by analyzing repositories and contributions
								</p>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="flex min-h-[100dvh] items-center justify-center border-border border-t border-dashed bg-muted/30">
				<div className="container mx-auto px-4 py-20">
					<h2 className="mb-16 text-center font-medium text-2xl">
						Key Features
					</h2>

					<div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2">
						<div className="flex gap-5">
							<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 p-3.5">
								<Search className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="mb-2 font-medium text-base">
									Google-like Search
								</h3>
								<p className="text-muted-foreground text-sm">
									Search for developers by stack, location, stars, and more.
									With rich autocomplete.
								</p>
							</div>
						</div>

						<div className="flex gap-5">
							<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 p-3.5">
								<Mic className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="mb-2 font-medium text-base">Audio Insights</h3>
								<p className="text-muted-foreground text-sm">
									Get a voice summary of top developers matching your search,
									powered by LLM + ElevenLabs.
								</p>
							</div>
						</div>

						<div className="flex gap-5">
							<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 p-3.5">
								<User className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="mb-2 font-medium text-base">Auto-Indexation</h3>
								<p className="text-muted-foreground text-sm">
									Add yourself to the search index with your GitHub profile or
									LinkedIn to be discoverable.
								</p>
							</div>
						</div>

						<div className="flex gap-5">
							<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 p-3.5">
								<ArrowUp className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="mb-2 font-medium text-base">Smart Alerts</h3>
								<p className="text-muted-foreground text-sm">
									Save filters and get notified via email, Slack, or webhooks
									when new matching developers appear.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="flex min-h-[100dvh] items-center justify-center border-border border-t border-dashed">
				<div className="container mx-auto px-4 text-center">
					<div className="mx-auto max-w-2xl">
						<h2 className="mb-4 font-medium text-2xl">
							Start Finding Real Open-Source Talent
						</h2>
						<p className="mx-auto mb-8 max-w-xl text-muted-foreground">
							Discover developers based on their actual contributions,
							technology stack, and availability.
						</p>
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Button
								size="lg"
								className="bg-primary px-6 text-primary-foreground hover:bg-primary/90"
							>
								Try GitHunter Free
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-border px-6"
							>
								Learn More
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-border border-t border-dashed bg-background">
				<div className="container mx-auto px-4 py-10">
					<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
						<div className="flex items-center gap-2">
							<Image
								src="/github-logo.svg"
								alt="GitHunter Logo"
								width={20}
								height={20}
								className="dark:invert"
							/>
							<span className="text-muted-foreground text-sm">
								© 2023 GitHunter
							</span>
						</div>
						<div className="flex gap-8">
							<a
								href="#about"
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								About
							</a>
							<a
								href="#features"
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Privacy
							</a>
							<a
								href="#terms"
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Terms
							</a>
							<a
								href="#contact"
								className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								Contact
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
