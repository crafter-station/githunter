"use client";

import { useCompletion } from "@ai-sdk/react";
import { AlertCircle, Loader2, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface SpokenDigestProps {
	slug: string;
}

export function SpokenDigest({ slug }: SpokenDigestProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState<string | null>(null);
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
			setError(null);

			// Connect to ElevenLabs API endpoint
			const response = await fetch("/api/tts/play", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: completion,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Obtener el contenido base64
			const base64Audio = await response.text();

			// Convertir base64 a blob
			const binaryString = window.atob(base64Audio);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			// Crear un blob de audio a partir de los bytes
			const audioBlob = new Blob([bytes], { type: "audio/mpeg" });

			// Crear una URL para el blob
			const audioUrl = URL.createObjectURL(audioBlob);

			// Crear y reproducir el elemento de audio
			const audio = new Audio(audioUrl);

			// Manejar cuando termina de reproducirse
			audio.onended = () => {
				setIsPlaying(false);
				URL.revokeObjectURL(audioUrl); // Limpiar la URL cuando termine
			};

			// Manejar errores
			audio.onerror = (e) => {
				console.error("Error playing audio:", e);
				setError("Error al reproducir el audio");
				setIsPlaying(false);
				URL.revokeObjectURL(audioUrl);
				toast.error("No se pudo reproducir el audio");
			};

			// Iniciar reproducción
			await audio.play();
		} catch (error) {
			console.error("Failed to play audio:", error);
			setError(
				error instanceof Error ? error.message : "Error al generar el audio",
			);
			setIsPlaying(false);
			toast.error("No se pudo generar el audio");
		}
	};

	// Display loading state
	if (isLoading && !completion) {
		return (
			<div className="mb-4 space-y-3">
				<div className="overflow-hidden rounded-lg border bg-muted/10">
					{/* Header skeleton */}
					<div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2">
						<div className="flex items-center gap-2">
							<Volume2 className="h-4 w-4 text-blue-500/50" />
							<span className="font-medium text-muted-foreground/70 text-sm">
								Search Digest
							</span>
						</div>
						<Skeleton className="h-8 w-16 rounded-md" />
					</div>

					{/* Content skeleton */}
					<div className="p-3">
						<div className="w-full space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-[90%]" />
							<Skeleton className="h-4 w-[85%]" />
							<Skeleton className="h-4 w-[95%]" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mb-4 space-y-3">
			<div className="overflow-hidden rounded-lg border bg-muted/10">
				{/* Header section with title and listen button */}
				<div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2">
					<div className="flex items-center gap-2">
						<Sparkles className="h-4 w-4 text-blue-500" />
						<span className="font-medium text-sm">Search Digest</span>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="flex h-8 items-center gap-1.5 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
						onClick={playSpokenDigest}
						disabled={isPlaying}
					>
						{isPlaying ? (
							<>
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								<span className="text-xs">Playing...</span>
							</>
						) : (
							<>
								{isLoading ? (
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
								) : (
									<Volume2 className="h-3.5 w-3.5" />
								)}
								<span className="text-xs">Listen</span>
							</>
						)}
					</Button>
				</div>

				{/* Error message if necessary */}
				{error && (
					<div className="bg-red-50 px-3 py-2 dark:bg-red-950/20">
						<div className="flex items-center gap-2 text-red-600 text-xs dark:text-red-400">
							<AlertCircle className="h-3.5 w-3.5" />
							<span>{error}</span>
						</div>
					</div>
				)}

				{/* Content section */}
				<div className="p-3">
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
				</div>
			</div>
		</div>
	);
}
