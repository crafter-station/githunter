"use client";

import { useCompletion } from "@ai-sdk/react";
import { Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpokenDigestProps {
	slug: string;
}

export function SpokenDigest({ slug }: SpokenDigestProps) {
	const [isPlaying, setIsPlaying] = useState(false);

	const hasCompleted = useRef(false);

	const { completion, isLoading, complete } = useCompletion({
		api: "/api/search/summary",
		body: {
			slug,
		},
	});

	useEffect(() => {
		if (!hasCompleted.current) {
			complete("");
			hasCompleted.current = true;
		}
	}, [complete]);

	// Function to play the spoken digest with ElevenLabs
	const playSpokenDigest = async () => {
		if (!completion) return;

		try {
			setIsPlaying(true);
			// This would connect to your ElevenLabs API endpoint
			await fetch("/api/tts/play", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: completion,
				}),
			});
		} catch (error) {
			console.error("Failed to play audio:", error);
		} finally {
			setIsPlaying(false);
		}
	};

	if (!completion) return null;

	return (
		<div className="mb-4 space-y-3">
			<div className="rounded-lg border bg-muted/10">
				<div className="p-3">
					<div className="flex items-center justify-between">
						<div className="text-muted-foreground text-xs leading-relaxed">
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={{
									strong: ({ node, ...props }) => (
										<strong
											className="font-semibold text-foreground"
											{...props}
										/>
									),
									em: ({ node, ...props }) => (
										<em className="text-foreground/80 italic" {...props} />
									),
								}}
							>
								{completion}
							</ReactMarkdown>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="ml-2 flex h-7 items-center gap-1.5 px-3 text-xs"
							onClick={playSpokenDigest}
							disabled={isPlaying || isLoading}
						>
							{isPlaying ? "Playing" : "Listen"}
							<Volume2
								className={cn("h-3.5 w-3.5", isPlaying && "animate-pulse")}
							/>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
