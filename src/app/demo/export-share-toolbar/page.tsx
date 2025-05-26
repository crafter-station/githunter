"use client";

import { ExportShareToolbar } from "@/components/cv/export-share-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function ExportShareToolbarDemo() {
	const [isExporting, setIsExporting] = useState(false);
	const [isGeneratingLink, setIsGeneratingLink] = useState(false);
	const [shareUrl, setShareUrl] = useState<string | undefined>();
	const [position, setPosition] = useState<"bottom" | "top">("bottom");

	const handleExportPDF = async () => {
		setIsExporting(true);
		toast.info("Starting PDF export...");

		// Simulate PDF generation
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsExporting(false);
		toast.success("PDF exported successfully!");
	};

	const handleGenerateLink = async () => {
		setIsGeneratingLink(true);
		toast.info("Generating shareable link...");

		// Simulate link generation
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const mockUrl = `https://githunter.dev/cv/${Math.random().toString(36).substring(7)}`;
		setShareUrl(mockUrl);
		setIsGeneratingLink(false);
		toast.success("Shareable link generated!");
	};

	const handleCopyLink = async () => {
		if (!shareUrl) {
			await handleGenerateLink();
		}
	};

	const resetDemo = () => {
		setShareUrl(undefined);
		setIsExporting(false);
		setIsGeneratingLink(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
			<div className="mx-auto max-w-4xl space-y-8">
				{/* Header */}
				<div className="space-y-4 text-center">
					<h1 className="font-bold text-4xl tracking-tight">
						Export & Share Toolbar
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						A Linear-inspired floating toolbar for exporting CVs to PDF and
						sharing them with others. Features smart link generation, native
						sharing, and elegant interactions.
					</p>
				</div>

				{/* Demo Controls */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							Demo Controls
							<Badge variant="secondary">Interactive</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-wrap gap-3">
							<Button onClick={handleGenerateLink} disabled={isGeneratingLink}>
								{isGeneratingLink ? "Generating..." : "Generate Share Link"}
							</Button>
							<Button onClick={handleExportPDF} disabled={isExporting}>
								{isExporting ? "Exporting..." : "Test PDF Export"}
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									setPosition(position === "bottom" ? "top" : "bottom")
								}
							>
								Position: {position}
							</Button>
							<Button variant="outline" onClick={resetDemo}>
								Reset Demo
							</Button>
						</div>

						{shareUrl && (
							<div className="rounded-lg bg-muted p-3">
								<p className="mb-1 font-medium text-sm">Generated Share URL:</p>
								<code className="break-all text-muted-foreground text-xs">
									{shareUrl}
								</code>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Features */}
				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Export Features</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<h4 className="font-medium">PDF Export</h4>
								<p className="text-muted-foreground text-sm">
									High-quality PDF generation with loading states and progress
									feedback.
								</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-medium">Smart Loading</h4>
								<p className="text-muted-foreground text-sm">
									Elegant loading animations and disabled states during
									processing.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Share Features</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-2">
								<h4 className="font-medium">Native Sharing</h4>
								<p className="text-muted-foreground text-sm">
									Uses Web Share API when available, falls back to clipboard
									copy.
								</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-medium">Quick Actions</h4>
								<p className="text-muted-foreground text-sm">
									One-click link copying and instant CV viewing in new tabs.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Design Principles */}
				<Card>
					<CardHeader>
						<CardTitle>Linear Design Principles</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<h4 className="font-medium">Minimal & Clean</h4>
								<p className="text-muted-foreground text-sm">
									Rounded-full buttons, subtle hover states, and clean
									typography.
								</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-medium">Responsive Design</h4>
								<p className="text-muted-foreground text-sm">
									Adapts to mobile with icon-only buttons and optimized
									popovers.
								</p>
							</div>
							<div className="space-y-2">
								<h4 className="font-medium">Smart Interactions</h4>
								<p className="text-muted-foreground text-sm">
									Contextual tooltips, loading states, and success feedback.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Mock CV Content */}
				<Card>
					<CardHeader>
						<CardTitle>Mock CV Preview</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4 rounded-lg border bg-white p-6 dark:bg-slate-900">
							<div className="space-y-2 text-center">
								<h2 className="font-bold text-2xl">John Doe</h2>
								<p className="text-muted-foreground">
									Senior Frontend Engineer
								</p>
								<p className="text-muted-foreground text-sm">
									john.doe@example.com • +1 (555) 123-4567 •
									linkedin.com/in/johndoe
								</p>
							</div>

							<div className="space-y-3">
								<h3 className="border-b pb-1 font-semibold">Experience</h3>
								<div className="space-y-2">
									<div>
										<h4 className="font-medium">Tech Corp</h4>
										<p className="text-sm italic">Senior Frontend Engineer</p>
										<p className="text-muted-foreground text-xs">
											Jan 2022 - Present
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-3">
								<h3 className="border-b pb-1 font-semibold">Skills</h3>
								<div className="flex flex-wrap gap-2">
									{["React", "TypeScript", "Next.js", "Tailwind CSS"].map(
										(skill) => (
											<Badge key={skill} variant="secondary">
												{skill}
											</Badge>
										),
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Instructions */}
				<Card>
					<CardHeader>
						<CardTitle>Try the Toolbar</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-muted-foreground text-sm">
								The floating toolbar is positioned at the {position} of the
								screen. Try the following:
							</p>
							<ul className="ml-4 space-y-1 text-muted-foreground text-sm">
								<li>• Click "Export PDF" to simulate PDF generation</li>
								<li>• Use "Share" to see sharing options</li>
								<li>• Try the quick copy link button</li>
								<li>
									• Click "View CV" to open in a new tab (when link is
									generated)
								</li>
								<li>• Test on mobile for responsive behavior</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Export & Share Toolbar */}
			<ExportShareToolbar
				onExportPDF={handleExportPDF}
				onCopyLink={handleCopyLink}
				shareUrl={shareUrl}
				isExporting={isExporting}
				isGeneratingLink={isGeneratingLink}
				position={position}
			/>
		</div>
	);
}
