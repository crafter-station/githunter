import { CVPreview } from "@/components/cv/cv-preview";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { CV_PRESETS } from "@/lib/cv-presets";
import { Download, Edit, Share } from "lucide-react";
import Link from "next/link";

export default function CVPreviewPage() {
	// Use Anthony's CV as default for demo
	const demoCV = CV_PRESETS["anthony-cueva"];

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />

			<main className="flex flex-1 flex-col py-8">
				<div className="mx-auto w-full max-w-4xl px-4">
					{/* Minimal Header */}
					<div className="mb-8 text-center">
						<h1 className="mb-3 font-semibold text-2xl tracking-tight">
							CV Preview
						</h1>
						<p className="mb-6 text-muted-foreground">
							Beautiful, professional CV ready to share
						</p>

						{/* Minimal Action Buttons */}
						<div className="flex justify-center gap-3">
							<Link href="/cv">
								<Button
									variant="ghost"
									size="sm"
									className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
								>
									<Edit className="h-4 w-4" />
									Edit
								</Button>
							</Link>
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<Download className="h-4 w-4" />
								Download PDF
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
							>
								<Share className="h-4 w-4" />
								Share
							</Button>
						</div>
					</div>

					{/* CV Preview - Clean Design */}
					<div className="mb-8 rounded-lg border border-border bg-background p-8 shadow-sm">
						<CVPreview cvData={demoCV} />
					</div>

					{/* Minimal Call to Action */}
					<div className="border-border/50 border-t py-6 text-center">
						<div className="mx-auto max-w-lg space-y-3">
							<h2 className="font-medium text-lg">Ready to create your own?</h2>
							<p className="text-muted-foreground text-sm">
								Upload your CV or start from scratch with our intelligent editor
							</p>
							<div className="flex justify-center gap-3 pt-3">
								<Link href="/cv">
									<Button size="sm" className="flex items-center gap-2">
										<Edit className="h-4 w-4" />
										Create Your CV
									</Button>
								</Link>
								<Link href="/cv">
									<Button
										size="sm"
										variant="outline"
										className="flex items-center gap-2"
									>
										<Download className="h-4 w-4" />
										Upload & Extract
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
