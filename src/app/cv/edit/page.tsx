import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { CVEditorForm } from "@/components/cv/cv-editor-form";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";

import { type PersistentCurriculumVitae, db, user as userTable } from "@/db";

export default async function CVEditorPage() {
	const session = await auth();

	if (!session.userId) {
		redirect("/sign-in");
	}

	const users = await db
		.select({
			cv: userTable.curriculumVitae,
		})
		.from(userTable)
		.where(eq(userTable.clerkId, session.userId))
		.limit(1);

	if (!users.length) {
		redirect("/sign-in");
	}
	const user = users[0];

	const cv = (user.cv || {}) as PersistentCurriculumVitae;

	return (
		<div className="flex min-h-[100dvh] flex-col bg-muted/50">
			<Header noSearch />

			<main className="flex flex-1 flex-col items-center justify-center">
				<CVEditorForm initialData={cv} />
			</main>

			<Footer className="pb-24" />
		</div>
	);
}
