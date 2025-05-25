import { ilike } from "drizzle-orm";
import { Edit } from "lucide-react";
import Link from "next/link";

import { db, user as userTable } from "@/db";

import { buttonVariants } from "@/components/ui/button";

import { CVPreview } from "@/components/cv/cv-preview";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";

import { cn } from "@/lib/utils";

export default async function CVPreviewPage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;

	const users = await db
		.select({
			cv: userTable.curriculumVitae,
		})
		.from(userTable)
		.where(ilike(userTable.username, `%${username}%`))
		.limit(1);

	if (!users.length) {
		return <div>User not found</div>;
	}

	const cv = users[0].cv;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />

			<main className="flex flex-1 flex-col py-8">
				<div className="mx-auto w-full max-w-4xl px-4">
					{/* CV Preview - Clean Design */}
					<div className="mb-8 rounded-lg border border-border bg-background p-8 shadow-sm">
						<CVPreview cvData={cv || {}} />
					</div>

					{/* Minimal Call to Action */}
					<div className="border-border/50 border-t py-6 text-center">
						<div className="mx-auto max-w-lg space-y-3">
							<h2 className="font-medium text-lg">Ready to create your own?</h2>
							<p className="text-muted-foreground text-sm">
								Upload your CV or start from scratch with our intelligent editor
							</p>
							<div className="flex justify-center gap-3 pt-3">
								<Link
									href="/cv/edit"
									className={cn(
										buttonVariants({ variant: "default" }),
										"flex items-center gap-2",
									)}
								>
									<Edit className="h-4 w-4" />
									Create Your CV
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
