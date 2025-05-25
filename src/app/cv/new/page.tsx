import { CVEditorForm } from "@/components/cv/cv-editor-form";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";
import { Plus } from "lucide-react";

export default function BlankCVEditorPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />

			<main className="flex flex-1 flex-col py-12">
				<div className="mx-auto w-full max-w-4xl px-4">
					<div className="mb-8 text-center">
						<div className="mb-2 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
							<Plus className="h-6 w-6" />
						</div>
						<h1 className="font-semibold text-2xl tracking-tight">
							Create New CV
						</h1>
						<p className="mt-2 text-muted-foreground text-sm">
							Build your professional CV with our intuitive editor
						</p>
					</div>
					<CVEditorForm />
				</div>
			</main>

			<Footer />
		</div>
	);
}
