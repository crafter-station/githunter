"use client";

import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { ArrowLeft, CheckCircle, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { TriggerProvider } from "@/components/TriggerProvider";
import { buttonVariants } from "@/components/ui/button";

// Task progress stages and display names
const PROGRESS_STAGES = {
	ocr: "Processing document with OCR",
	object_generation: "Extracting information from CV",
	store_curriculum_vitae: "Saving CV to database",
	completed: "CV processing completed",
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

function CVUploadingContent() {
	const searchParams = useSearchParams();
	const runId = searchParams.get("runId");
	const token = searchParams.get("token");

	if (!runId || !token) {
		return (
			<div className="w-full max-w-md px-4">
				<div className="mb-8 text-center">
					<h1 className="font-semibold text-2xl tracking-tight">Error</h1>
					<p className="mt-2 text-muted-foreground text-sm">
						Unable to track CV processing. Missing run ID or access token.
					</p>
				</div>
			</div>
		);
	}

	const { run, error } = useRealtimeRun(runId);

	if (error) {
		return (
			<div className="w-full max-w-md px-4 text-center">
				<h1 className="mb-4 font-semibold text-2xl tracking-tight">Error</h1>
				<p className="text-destructive text-sm">
					Failed to connect to real-time updates: {error.message}
				</p>
				<div className="mt-6">
					<Link
						href="/cv/edit"
						className={buttonVariants({ variant: "outline", size: "sm" })}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to CV editor
					</Link>
				</div>
			</div>
		);
	}

	if (!run) {
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

	const currentStage = (run.metadata?.progress as string) || "ocr";
	const status = run.status;

	return (
		<div className="w-full max-w-md px-4">
			<div className="mb-6 text-center">
				<h1 className="mb-1 font-semibold text-2xl tracking-tight">
					Processing Your CV
				</h1>
				<p className="text-muted-foreground text-sm">
					Status: {STATUS_MAP[status as keyof typeof STATUS_MAP] || status}
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
								currentStage === "completed" ||
								(currentStage &&
									Object.keys(PROGRESS_STAGES).indexOf(currentStage) >
										Object.keys(PROGRESS_STAGES).indexOf(stage));

							const isCurrent = currentStage === stage;
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

			{status === "COMPLETED" ? (
				<div className="mt-8 space-y-4">
					<p className="text-center font-medium text-[#008080] text-sm text-success dark:text-[#98FEE3]">
						CV successfully processed!
					</p>
					<div className="flex flex-col gap-3">
						<Link href="/cv/edit" className={buttonVariants({ size: "sm" })}>
							View CV
						</Link>
						<Link
							href="/cv/edit"
							className={buttonVariants({ variant: "outline", size: "sm" })}
						>
							Edit CV
						</Link>
					</div>
				</div>
			) : status === "FAILED" ? (
				<div className="mt-8 space-y-4">
					<p className="text-center font-medium text-destructive text-sm">
						Failed to process CV
					</p>
					<div className="flex flex-col gap-3">
						<Link
							href="/cv/edit"
							className={buttonVariants({ variant: "outline", size: "sm" })}
						>
							Try again
						</Link>
					</div>
				</div>
			) : (
				<div className="mt-8 text-center">
					<Link
						href="/cv/edit"
						className={buttonVariants({ variant: "outline", size: "sm" })}
					>
						Back to CV editor
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
				<X className="h-3 w-3" />
			</div>
		);
	}

	if (["EXECUTING", "QUEUED", "REATTEMPTING"].includes(status)) {
		return <Loader2 className="h-4.5 w-4.5 animate-spin text-primary" />;
	}

	return null;
}

export default function CVUploadingPage() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	return (
		<>
			<Header />
			<main className="flex min-h-screen flex-col items-center justify-center p-4">
				<TriggerProvider accessToken={token || ""}>
					<CVUploadingContent />
				</TriggerProvider>
			</main>
			<Footer />
		</>
	);
}
