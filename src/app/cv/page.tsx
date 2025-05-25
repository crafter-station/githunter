import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Form } from "./form";

export default function CVGeneratorPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />

			<main className="flex flex-1 flex-col items-center justify-center py-12">
				<div className="w-full max-w-4xl px-4">
					<div className="mb-8 text-center">
						<div className="mb-2 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
							<FileText className="h-6 w-6" />
						</div>
						<h1 className="font-semibold text-2xl tracking-tight">
							AI-Powered CV Generator
						</h1>
						<p className="mt-2 text-muted-foreground text-sm">
							Transform your career documents with intelligent extraction and
							beautiful formatting
						</p>
					</div>

					{/* Mobile: Stack vertically, Desktop: Left-right layout */}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* Upload & Extract - Left panel (highlighted) */}
						<div className="rounded-lg border-2 border-[#e0e26c] p-6 dark:border-[#E6E7A4] dark:bg-primary/5">
							<h3 className="mb-2 font-medium text-lg">Upload & Extract</h3>
							<p className="mb-4 text-muted-foreground text-sm">
								Upload your existing CV and let AI extract the information
							</p>
							<Form />
						</div>

						{/* Right column with two sections */}
						<div className="grid grid-rows-2 gap-4">
							{/* Start from Scratch */}
							<div className="flex flex-col rounded-lg border bg-card p-4">
								<h3 className="mb-2 font-medium">Start from Scratch</h3>
								<p className="mb-4 flex-1 text-muted-foreground text-sm">
									Build your CV from the ground up with our editor
								</p>
								<Link href="/cv/new">
									<Button variant="outline" className="w-full">
										<Plus className="mr-2 h-4 w-4" />
										Create New CV
									</Button>
								</Link>
							</div>

							{/* View Demo */}
							<div className="flex flex-col rounded-lg border bg-card p-4">
								<h3 className="mb-2 font-medium">View Demo</h3>
								<p className="mb-4 flex-1 text-muted-foreground text-sm">
									See how beautiful your CV can look
								</p>
								<Link href="/cv/preview">
									<Button variant="outline" className="w-full">
										<Eye className="mr-2 h-4 w-4" />
										See Demo CV
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
