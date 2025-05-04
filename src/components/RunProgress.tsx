"use client";

import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

// Task progress stages and display names
const PROGRESS_STAGES = {
	initial_data_collected: "Initial user data collected",
	fetching_repo_details: "Fetching repository details",
	generating_user_metadata: "Generating user profile metadata",
	saving_to_database: "Saving profile to database",
	completed: "Profile generation completed",
};

// Possible run statuses
const STATUS_MAP = {
	WAITING_FOR_DEPLOY: "Waiting for deployment",
	QUEUED: "Queued",
	EXECUTING: "Executing",
	COMPLETED: "Completed",
	FAILED: "Failed",
	CANCELED: "Canceled",
	REATTEMPTING: "Retrying",
	CRASHED: "Crashed",
	TIMED_OUT: "Timed out",
};

export function RunProgress({
	runId,
	username,
}: { runId: string; username: string }) {
	// Use the hook properties available in the API
	const { run, error } = useRealtimeRun(runId);
	const progressStage = run?.metadata?.progress as string | undefined;
	const isLoading = !run && !error;

	if (isLoading) {
		return (
			<div className="container mx-auto flex max-w-2xl flex-col items-center px-4 py-16">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<h2 className="mt-4 font-semibold text-xl">
					Connecting to real-time updates...
				</h2>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto max-w-2xl px-4 py-16">
				<h1 className="mb-6 font-bold text-3xl">Error</h1>
				<p className="text-destructive">
					Failed to connect to real-time updates: {error.message}
				</p>
			</div>
		);
	}

	if (!run) {
		return (
			<div className="container mx-auto max-w-2xl px-4 py-16">
				<h1 className="mb-6 font-bold text-3xl">Run Not Found</h1>
				<p>Unable to find the specified run.</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-2xl px-4 py-16">
			<div className="mb-8">
				<h1 className="font-bold text-3xl">GitHub Profile: {username}</h1>
				<p className="mt-2 text-muted-foreground">
					Current status:{" "}
					<span className="font-medium">
						{STATUS_MAP[run.status as keyof typeof STATUS_MAP] || run.status}
					</span>
				</p>
			</div>

			<div className="rounded-lg border bg-card shadow-sm">
				<div className="p-6">
					<h2 className="mb-4 font-semibold text-xl">Processing Tasks</h2>

					<div className="space-y-3">
						{Object.entries(PROGRESS_STAGES).map(([stage, description]) => {
							// Calculate if this stage is completed, current, or pending
							const isCompleted =
								progressStage === "completed" ||
								(progressStage &&
									Object.keys(PROGRESS_STAGES).indexOf(progressStage) >
										Object.keys(PROGRESS_STAGES).indexOf(stage));

							const isCurrent = progressStage === stage;
							const status = isCompleted
								? "COMPLETED"
								: isCurrent
									? "EXECUTING"
									: "PENDING";

							return (
								<div
									key={stage}
									className="flex items-center justify-between rounded-md bg-muted p-3"
								>
									<div>
										<p className="font-medium">{description}</p>
										<p className="text-muted-foreground text-sm">
											{isCompleted
												? "Completed"
												: isCurrent
													? "In progress"
													: "Pending"}
										</p>
									</div>
									<TaskStatusIcon status={status} />
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{run.status === "COMPLETED" && (
				<div className="mt-8 text-center">
					<p className="mb-4 font-medium text-primary">
						All tasks completed successfully!
					</p>
					<a
						href={`/users/${username}`}
						className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
					>
						View Profile
					</a>
				</div>
			)}
			<div className="mt-8 flex justify-center">
				<Link href="/new" className={buttonVariants({ variant: "outline" })}>
					Add another user
				</Link>
			</div>
		</div>
	);
}

function TaskStatusIcon({ status }: { status: string }) {
	if (status === "COMPLETED") {
		return <CheckCircle className="h-6 w-6 text-success" />;
	}

	if (["FAILED", "CANCELED", "CRASHED", "TIMED_OUT"].includes(status)) {
		return <div className="h-6 w-6 text-destructive">✗</div>;
	}

	if (["EXECUTING", "QUEUED", "REATTEMPTING"].includes(status)) {
		return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
	}

	return <Clock className="h-6 w-6 text-muted-foreground" />;
}
