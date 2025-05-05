import { Footer } from "@/components/footer";
import { Header } from "@/components/header-2";
import { Card } from "@/components/ui/card";
import { ArrowUp, BarChart2, FileText, Mic, Search, User } from "lucide-react";

export default function AboutPage() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			{/* Header */}
			<Header />

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

			{/* Footer */}
			<Footer />
		</div>
	);
}
