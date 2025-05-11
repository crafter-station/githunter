import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";
import { ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Form } from "./form";
// Define a type for the form state returned by the server action

export default async function NewProfilePage() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />

			<main className="flex flex-1 flex-col items-center justify-center py-12">
				<div className="w-full max-w-md px-4">
					<div className="mb-8 text-center">
						<div className="mb-2 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
							<RefreshCw className="h-6 w-6" />
						</div>
						<h1 className="font-semibold text-2xl tracking-tight">
							Index or update a GitHub Profile
						</h1>
						<p className="mt-2 text-muted-foreground text-sm">
							Unlock detailed metrics and discover hidden talents of any GitHub
							developer
						</p>
					</div>

					<Form />

					<div className="mt-6 text-center text-muted-foreground text-xs">
						<Link
							href="/"
							className="inline-flex items-center hover:text-primary hover:underline"
						>
							<ArrowRight className="mr-1 h-3 w-3 rotate-180" />
							Return to developer search
						</Link>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
