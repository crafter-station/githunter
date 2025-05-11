"use client";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { createGithubProfileAction } from "@/actions/create-github-profile";
import { Github } from "@/components/icons/github";
import { buttonVariants } from "@/components/ui/button";
import { useSubscription } from "@/lib/hooks/useSuscription";
import Link from "next/link";

interface FormState {
	error: string | null;
	success?: boolean;
	redirectUrl?: string;
}

export function Form() {
	const router = useRouter();
	const initialState: FormState = { error: null };
	const [state, formAction] = useActionState(
		createGithubProfileAction,
		initialState,
	);

	const searchParams = useSearchParams();
	const username = searchParams.get("username");

	// Handle redirect when action returns a redirectUrl
	useEffect(() => {
		if (state?.redirectUrl) {
			router.push(state.redirectUrl);
		}
	}, [state, router]);

	return (
		<form action={formAction} className="space-y-6">
			<div className="space-y-2">
				<div className="relative rounded-md border border-input bg-background transition-colors focus-within:ring-1 focus-within:ring-ring">
					<div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
						<Github className="h-4 w-4 text-muted-foreground" />
					</div>
					<input
						id="username"
						name="username"
						type="text"
						placeholder="GitHub username"
						required
						className="w-full border-0 bg-transparent py-3 pr-4 pl-10 text-sm focus:outline-none"
						defaultValue={username ?? undefined}
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
	const { currentPlan } = useSubscription();

	const searchParams = useSearchParams();

	if (currentPlan?.name !== "Plus") {
		return (
			<div className="flex w-full justify-center">
				<Link
					href="/pricing"
					className={buttonVariants({ variant: "secondary" })}
				>
					Upgrade to Plus to index profiles
				</Link>
			</div>
		);
	}

	return (
		<button
			type="submit"
			disabled={pending}
			className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:bg-primary/50"
		>
			<span>{pending ? "Processing..." : "Generate Profile"}</span>
			{!pending && <ArrowRight className="h-4 w-4" />}
		</button>
	);
}
