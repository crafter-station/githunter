"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { processCVAction } from "@/actions/process-cv";
import { buttonVariants } from "@/components/ui/button";
import Dropzone from "@/components/ui/dropzone";
import { useSubscription } from "@/lib/hooks/useSuscription";
import Link from "next/link";

interface FormState {
	error: string | null;
	success?: boolean;
	redirectUrl?: string;
}

export function Form() {
	const router = useRouter();
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const initialState: FormState = { error: null };
	const [state, formAction] = useActionState(processCVAction, initialState);

	const handleFileUpload = (acceptedFiles: File[]) => {
		setUploadedFiles(acceptedFiles);
	};

	// Handle redirect when action returns a redirectUrl
	useEffect(() => {
		if (state?.redirectUrl) {
			router.push(state.redirectUrl);
		}
	}, [state, router]);

	// Handle form submission with file data
	const handleFormAction = (formData: FormData) => {
		if (uploadedFiles.length > 0) {
			formData.set("cv-file", uploadedFiles[0]);
		}
		formAction(formData);
	};

	return (
		<form action={handleFormAction} className="space-y-6">
			<div className="space-y-2">
				<Dropzone
					accept={{
						"application/pdf": [".pdf"],
						"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
							[".docx"],
						"application/msword": [".doc"],
					}}
					maxSize={10 * 1024 * 1024} // 10MB
					multiple={false}
					onDrop={handleFileUpload}
					dropZoneClassName="border-border hover:border-primary/50"
				/>
				{state.error && (
					<p className="text-destructive text-sm">{state.error}</p>
				)}
			</div>

			<SubmitButton hasFiles={uploadedFiles.length > 0} />
		</form>
	);
}

function SubmitButton({ hasFiles }: { hasFiles: boolean }) {
	const { pending } = useFormStatus();
	const { currentPlan } = useSubscription();

	if (currentPlan?.name !== "Plus") {
		return (
			<div className="flex w-full justify-center">
				<Link
					href="/pricing"
					className={buttonVariants({ variant: "default" })}
				>
					Upgrade to Plus to generate CV
				</Link>
			</div>
		);
	}

	return (
		<button
			type="submit"
			disabled={pending || !hasFiles}
			className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:bg-primary/50"
		>
			<span>{pending ? "Processing..." : "Process CV"}</span>
			{!pending && <ArrowRight className="h-4 w-4" />}
		</button>
	);
}
