import { CVEditorForm } from "@/components/cv/cv-editor-form";
import { CVPreview } from "@/components/cv/cv-preview";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { CV_PRESETS } from "@/lib/cv-presets";
import { Edit3, Eye, FileText } from "lucide-react";

export default async function CVEditorPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ extracted?: string; mode?: "edit" | "preview" }>;
}) {
	const { id } = await params;
	const { extracted, mode = "edit" } = await searchParams;

	// For demo purposes, use preset data if available
	const demoCV = CV_PRESETS["anthony-cueva"];

	return (
		<div className="flex min-h-screen flex-col">
			<Header />

			<main className="flex flex-1 flex-col items-center justify-center py-12">
				<div className="w-full max-w-4xl px-4">
					<div className="mb-8 text-center">
						<div className="mb-2 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
							{mode === "preview" ? (
								<Eye className="h-6 w-6" />
							) : (
								<Edit3 className="h-6 w-6" />
							)}
						</div>
						<h1 className="font-semibold text-2xl tracking-tight">
							{mode === "preview" ? "CV Preview" : "CV Editor"} -{" "}
							{decodeURIComponent(id)}
						</h1>
						<p className="mt-2 text-muted-foreground text-sm">
							{mode === "preview"
								? "Beautiful, professional CV ready to share"
								: "Review and edit your extracted CV information"}
						</p>
					</div>

					{/* Mode Toggle */}
					<div className="mb-8 flex justify-center gap-2">
						<Button variant={mode === "edit" ? "default" : "outline"} asChild>
							<a
								href={`/cv/edit/${id}?mode=edit&extracted=${extracted || "true"}`}
							>
								<Edit3 className="mr-2 h-4 w-4" />
								Edit Mode
							</a>
						</Button>
						<Button
							variant={mode === "preview" ? "default" : "outline"}
							asChild
						>
							<a
								href={`/cv/edit/${id}?mode=preview&extracted=${extracted || "true"}`}
							>
								<Eye className="mr-2 h-4 w-4" />
								Preview Mode
							</a>
						</Button>
					</div>

					{extracted || mode === "preview" ? (
						<div className="space-y-6">
							{mode === "edit" ? (
								<>
									<div className="mb-6 text-center">
										<p className="text-muted-foreground text-sm">
											CV processing completed successfully! Review and edit your
											information below.
										</p>
									</div>
									<CVEditorForm initialData={demoCV} />
								</>
							) : (
								<div className="rounded-lg bg-slate-50 p-6">
									<CVPreview cvData={demoCV} />
								</div>
							)}
						</div>
					) : (
						<div className="rounded-lg border bg-card p-6">
							<div className="space-y-4 text-center">
								<div className="inline-flex items-center justify-center rounded-full bg-muted p-3">
									<FileText className="h-8 w-8 text-muted-foreground" />
								</div>
								<div>
									<h2 className="font-semibold text-lg">Processing CV</h2>
									<p className="text-muted-foreground text-sm">
										We're extracting information from your CV file. This may
										take a few moments...
									</p>
								</div>
								<div className="flex justify-center">
									<div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
								</div>
							</div>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
