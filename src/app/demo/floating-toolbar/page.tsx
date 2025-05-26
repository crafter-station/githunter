import { FloatingCVToolbar } from "@/components/cv/floating-cv-toolbar";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";

export default function FloatingToolbarDemo() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1 bg-muted/30">
				<div className="mx-auto max-w-4xl px-4 py-8">
					<div className="mb-8 text-center">
						<h1 className="font-bold text-3xl">Floating CV Toolbar Demo</h1>
						<p className="mt-2 text-muted-foreground">
							Experience the floating toolbar with undo/redo functionality
						</p>
					</div>

					{/* Mock CV Content */}
					<div className="rounded-lg border bg-background p-8 shadow-sm">
						<div className="space-y-6">
							<div>
								<h2 className="font-bold text-2xl">John Doe</h2>
								<p className="text-muted-foreground">Software Engineer</p>
								<p className="text-sm">
									john.doe@example.com | +1 (555) 123-4567
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg">Summary</h3>
								<p className="text-muted-foreground text-sm">
									Experienced software engineer with 5+ years of experience in
									full-stack development.
								</p>
							</div>

							<div>
								<h3 className="font-semibold text-lg">Experience</h3>
								<div className="space-y-4">
									<div>
										<h4 className="font-medium">Senior Software Engineer</h4>
										<p className="text-muted-foreground text-sm">
											Tech Company • 2021 - Present
										</p>
										<ul className="mt-2 list-inside list-disc text-muted-foreground text-sm">
											<li>Led development of microservices architecture</li>
											<li>Mentored junior developers</li>
										</ul>
									</div>
								</div>
							</div>

							<div>
								<h3 className="font-semibold text-lg">Education</h3>
								<div>
									<h4 className="font-medium">Bachelor of Computer Science</h4>
									<p className="text-muted-foreground text-sm">
										University of Technology • 2015 - 2019
									</p>
								</div>
							</div>

							<div>
								<h3 className="font-semibold text-lg">Skills</h3>
								<div className="flex flex-wrap gap-2">
									{["React", "Node.js", "TypeScript", "Python", "AWS"].map(
										(skill) => (
											<span
												key={skill}
												className="rounded-full bg-primary/10 px-3 py-1 text-primary text-sm"
											>
												{skill}
											</span>
										),
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Instructions */}
					<div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
						<h3 className="font-semibold text-blue-900 dark:text-blue-100">
							Try the keyboard shortcuts:
						</h3>
						<ul className="mt-2 space-y-1 text-blue-800 text-sm dark:text-blue-200">
							<li>
								<kbd className="rounded bg-blue-100 px-1 py-0.5 text-xs dark:bg-blue-900">
									⌘Z
								</kbd>{" "}
								or{" "}
								<kbd className="rounded bg-blue-100 px-1 py-0.5 text-xs dark:bg-blue-900">
									Ctrl+Z
								</kbd>{" "}
								- Undo
							</li>
							<li>
								<kbd className="rounded bg-blue-100 px-1 py-0.5 text-xs dark:bg-blue-900">
									⌘⇧Z
								</kbd>{" "}
								or{" "}
								<kbd className="rounded bg-blue-100 px-1 py-0.5 text-xs dark:bg-blue-900">
									Ctrl+Shift+Z
								</kbd>{" "}
								- Redo
							</li>
						</ul>
					</div>
				</div>

				{/* Floating Toolbar */}
				<FloatingCVToolbar
					onPreview={() => alert("Preview clicked!")}
					onSave={() => alert("Save clicked!")}
					onUpload={() => alert("Upload clicked!")}
					onTemplateSelect={(presetKey) =>
						alert(`Template selected: ${presetKey}`)
					}
					isSaving={false}
				/>
			</main>
			<Footer />
		</div>
	);
}
