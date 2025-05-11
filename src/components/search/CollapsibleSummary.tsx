"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CollapsibleSummaryProps {
	children: React.ReactNode;
	defaultExpanded?: boolean;
	maxHeight?: string;
	expandedMaxHeight?: string;
}

export function CollapsibleSummary({
	children,
	defaultExpanded = false,
	maxHeight = "180px",
	expandedMaxHeight = "800px",
}: CollapsibleSummaryProps) {
	const [expanded, setExpanded] = useState(defaultExpanded);

	return (
		<div className="relative mb-6 p-2">
			<div
				className={cn(
					"overflow-hidden transition-all duration-500 ease-in-out",
					expanded ? `max-h-[${expandedMaxHeight}]` : `max-h-[${maxHeight}]`,
				)}
			>
				{children}
			</div>

			{/* Mask overlay for entire content */}
			{!expanded && (
				<div
					className="absolute inset-0 bg-gradient-to-b"
					style={{
						background:
							"linear-gradient(to bottom, transparent 10%, var(--background) 95%)",
						pointerEvents: "none",
					}}
					aria-hidden="true"
				/>
			)}

			{/* Clickable overlay for expanding */}
			{!expanded && (
				<div
					className="absolute inset-0 cursor-pointer"
					onClick={() => setExpanded(true)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setExpanded(true);
						}
					}}
					role="button"
					tabIndex={0}
					aria-label="Expand content"
				/>
			)}

			{/* Expand/collapse toggle */}
			<div className="absolute right-0 bottom-0 left-0 flex justify-center pb-2">
				<Button
					variant="ghost"
					size="sm"
					className="z-10 h-7 w-7 rounded-full border bg-background/90 p-0 shadow-sm backdrop-blur-sm"
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? (
						<ChevronUp className="h-3.5 w-3.5" />
					) : (
						<ChevronDown className="h-3.5 w-3.5" />
					)}
				</Button>
			</div>
		</div>
	);
}
