"use client";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, Download, FileText, Link, Loader2, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportShareToolbarProps {
	onExportPDF?: () => void;
	onShareLink?: () => void;
	onCopyLink?: () => void;
	shareUrl?: string;
	isExporting?: boolean;
	isGeneratingLink?: boolean;
	className?: string;
	position?: "bottom" | "top";
}

export function ExportShareToolbar({
	onExportPDF,
	onShareLink,
	onCopyLink,
	shareUrl,
	isExporting = false,
	isGeneratingLink = false,
	className,
	position = "bottom",
}: ExportShareToolbarProps) {
	const [copied, setCopied] = useState(false);

	const handleCopyLink = async () => {
		if (!shareUrl) {
			if (onCopyLink) {
				onCopyLink();
			}
			return;
		}

		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			toast.success("Link copied to clipboard");
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error("Failed to copy link");
		}
	};

	const handleShare = async () => {
		if (!shareUrl) {
			if (onShareLink) {
				onShareLink();
			}
			return;
		}

		if (navigator.share) {
			try {
				await navigator.share({
					title: "My CV",
					text: "Check out my CV",
					url: shareUrl,
				});
			} catch (error) {
				// User cancelled or error occurred
				handleCopyLink();
			}
		} else {
			handleCopyLink();
		}
	};

	const positionClasses = {
		bottom: "bottom-4",
		top: "top-4",
	};

	return (
		<TooltipProvider delayDuration={200}>
			<div
				className={cn(
					"-translate-x-1/2 fixed left-1/2 z-50 transform",
					positionClasses[position],
					className,
				)}
			>
				<div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-lg backdrop-blur-sm">
					{/* Export PDF */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="hidden h-8 rounded-full px-3 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 sm:flex dark:hover:bg-blue-950/20"
								onClick={onExportPDF}
								disabled={isExporting}
							>
								{isExporting ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Download className="size-4" />
								)}
								<span className="font-medium text-sm">
									{isExporting ? "Exporting..." : "Export PDF"}
								</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
							<p>Download CV as PDF</p>
						</TooltipContent>
					</Tooltip>

					{/* Mobile Export PDF */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 sm:hidden dark:hover:bg-blue-950/20"
								onClick={onExportPDF}
								disabled={isExporting}
							>
								{isExporting ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Download className="size-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
							<p>Export PDF</p>
						</TooltipContent>
					</Tooltip>

					{/* Share Button */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="hidden h-8 rounded-full px-3 transition-all duration-200 hover:bg-green-50 hover:text-green-600 sm:flex dark:hover:bg-green-950/20"
								onClick={handleShare}
								disabled={isGeneratingLink}
							>
								{isGeneratingLink ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Share2 className="size-4" />
								)}
								<span className="font-medium text-sm">
									{isGeneratingLink ? "Generating..." : "Share"}
								</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
							<p>Share your CV</p>
						</TooltipContent>
					</Tooltip>

					{/* Mobile Share */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-green-50 hover:text-green-600 sm:hidden dark:hover:bg-green-950/20"
								onClick={handleShare}
								disabled={isGeneratingLink}
							>
								{isGeneratingLink ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Share2 className="size-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
							<p>Share CV</p>
						</TooltipContent>
					</Tooltip>

					{/* Quick Actions */}
					<div className="flex items-center space-x-1 border-border border-l pl-2">
						{/* Quick Copy Link */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-muted"
									onClick={handleCopyLink}
									disabled={isGeneratingLink}
								>
									{copied ? (
										<Check className="size-4 text-green-600" />
									) : (
										<Link className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
								<p>{copied ? "Copied!" : "Quick copy link"}</p>
							</TooltipContent>
						</Tooltip>

						{/* Primary Action - View CV */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="h-8 rounded-full bg-primary px-4 text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl"
									onClick={() => shareUrl && window.open(shareUrl, "_blank")}
									disabled={!shareUrl || isGeneratingLink}
								>
									<FileText className="size-4" />
									<span className="hidden font-medium sm:inline">View CV</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
								<p>View your CV in a new tab</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
