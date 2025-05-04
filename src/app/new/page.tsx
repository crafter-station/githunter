"use client";

import { createGithubProfileAction } from "@/actions/create-github-profile";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

// Define a type for the form state returned by the server action
interface FormState {
	error: string | null;
	success?: boolean;
	redirectUrl?: string;
}

export default function NewProfilePage() {
	return (
		<div className="container mx-auto max-w-lg px-4 py-16">
			<h1 className="mb-8 font-bold text-3xl">Create New GitHub Profile</h1>

			<Form />
		</div>
	);
}

function Form() {
	const router = useRouter();
	const initialState: FormState = { error: null };
	const [state, formAction] = useActionState(
		createGithubProfileAction,
		initialState,
	);

	// Handle redirect when action returns a redirectUrl
	useEffect(() => {
		if (state?.redirectUrl) {
			router.push(state.redirectUrl);
		}
	}, [state, router]);

	return (
		<form action={formAction} className="space-y-6">
			<div className="space-y-2">
				<label htmlFor="username" className="font-medium text-sm">
					GitHub Username
				</label>
				<div className="relative">
					<input
						id="username"
						name="username"
						type="text"
						placeholder="Enter a GitHub username"
						required
						className="w-full rounded-md border border-input px-4 py-2 focus:border-input focus:outline-none focus:ring-2 focus:ring-ring"
					/>
				</div>
				{state.error && (
					<p className="text-destructive text-sm">{state.error}</p>
				)}
			</div>

			<SubmitButton />
		</form>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:bg-primary/50"
		>
			<span>{pending ? "Processing..." : "Generate Profile"}</span>
			{!pending && <ArrowRight className="h-4 w-4" />}
		</button>
	);
}
