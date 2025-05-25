"use client";

import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { ArrowLeft, CheckCircle, Clock, Loader2 } from "lucide-react";
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
			<div className="w-full max-w-md px-4 text-center">
				<div className="mb-6 flex justify-center">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
				</div>
				<h2 className="font-semibold text-xl tracking-tight">
					Connecting to real-time updates...
				</h2>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full max-w-md px-4 text-center">
				<h1 className="mb-4 font-semibold text-2xl tracking-tight">Error</h1>
				<p className="text-destructive text-sm">
					Failed to connect to real-time updates: {error.message}
				</p>
				<div className="mt-6">
					<Link
						href="/new"
						className={buttonVariants({ variant: "outline", size: "sm" })}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to profile creation
					</Link>
				</div>
			</div>
		);
	}

	if (!run) {
		return (
			<div className="w-full max-w-md px-4 text-center">
				<h1 className="mb-4 font-semibold text-2xl tracking-tight">
					Run Not Found
				</h1>
				<p className="text-muted-foreground text-sm">
					Unable to find the specified run.
				</p>
				<div className="mt-6">
					<Link
						href="/new"
						className={buttonVariants({ variant: "outline", size: "sm" })}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to profile creation
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md px-4">
			<div className="mb-6 text-center">
				<h1 className="mb-1 font-semibold text-2xl tracking-tight">
					Building Profile for <span className="text-primary">@{username}</span>
				</h1>
				<p className="text-muted-foreground text-sm">
					Status:{" "}
					{STATUS_MAP[run.status as keyof typeof STATUS_MAP] || run.status}
				</p>
			</div>

			<div className="rounded-lg border border-border/50 bg-muted/20 shadow-sm">
				<div className="p-5">
					<h2 className="mb-4 font-medium text-muted-foreground text-sm uppercase">
						Processing Tasks
					</h2>

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
									className={`flex items-center justify-between rounded-md p-3 transition-colors ${
										isCompleted
											? "bg-success/5 text-success-foreground"
											: isCurrent
												? "bg-primary/5 text-primary"
												: "bg-muted/50 text-muted-foreground"
									}`}
								>
									<div>
										<p className="font-medium text-sm">{description}</p>
										<p className="text-xs opacity-80">
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

			{run.status === "COMPLETED" ? (
				<div className="mt-8 space-y-4">
					<p className="text-center font-medium text-[#008080] text-sm text-success dark:text-[#98FEE3]">
						Profile successfully generated!
					</p>
					<div className="flex flex-col gap-3">
						<a
							href={`/developer/${username}`}
							className={buttonVariants({ size: "sm" })}
						>
							View Profile
						</a>
						<Link
							href="/new"
							className={buttonVariants({ variant: "outline", size: "sm" })}
						>
							Add another developer
						</Link>
					</div>
				</div>
			) : (
				<div className="mt-8 text-center">
					<Link
						href="/new"
						className={buttonVariants({ variant: "outline", size: "sm" })}
					>
						Add another developer
					</Link>
				</div>
			)}
		</div>
	);
}

function TaskStatusIcon({ status }: { status: string }) {
	if (status === "COMPLETED") {
		return <CheckCircle className="h-4.5 w-4.5 text-success" />;
	}

	if (["FAILED", "CANCELED", "CRASHED", "TIMED_OUT"].includes(status)) {
		return (
			<div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-white text-xs">
				✗
			</div>
		);
	}

	if (["EXECUTING", "QUEUED", "REATTEMPTING"].includes(status)) {
		return <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />;
	}

	return <Clock className="h-4.5 w-4.5 text-muted-foreground opacity-70" />;
}
