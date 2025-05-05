import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
	title: string;
	subtitle?: string;
	description: string;
	icon: React.ReactNode;
	codeSnippet?: {
		command: string;
		error?: string;
	};
	actionButton?: {
		label: string;
		href: string;
		icon?: React.ReactNode;
		variant?: "default" | "outline";
		size?: "default" | "sm" | "lg";
	};
	titleSize?: "lg" | "xl" | "2xl" | "3xl";
	fullPage?: boolean;
}

export function EmptyState({
	title,
	subtitle,
	description,
	icon,
	codeSnippet,
	actionButton,
	titleSize = "3xl",
	fullPage = false,
}: EmptyStateProps) {
	const containerClass = fullPage
		? "mx-auto w-full max-w-2xl text-center"
		: "flex flex-col items-center justify-center text-center";

	const iconContainerClass = fullPage ? "mb-6 flex justify-center" : "mb-4";

	const titleClass = `mb-1 text-${titleSize} ${fullPage ? "font-bold" : "font-medium"}`;

	const descriptionClass = fullPage
		? "mb-6 text-muted-foreground"
		: "max-w-md text-sm text-muted-foreground mb-4";

	const snippetClass = fullPage
		? "mb-8 rounded-lg bg-muted p-4 font-mono text-sm"
		: "mb-5 rounded-lg bg-muted p-3 font-mono text-xs";

	const buttonSize = actionButton?.size || (fullPage ? "lg" : "sm");
	const buttonVariant =
		actionButton?.variant || (fullPage ? "default" : "outline");
	const buttonGapClass = fullPage ? "gap-2" : "gap-1";

	return (
		<div className={containerClass}>
			<div className={iconContainerClass}>{icon}</div>
			<h3 className={titleClass}>{title}</h3>
			{subtitle && (
				<p className="mb-2 font-medium text-muted-foreground text-xl">
					{subtitle}
				</p>
			)}
			<p className={descriptionClass}>{description}</p>

			{codeSnippet && (
				<div className={snippetClass}>
					<p className="text-left text-muted-foreground">
						<span className="text-green-500">$</span> {codeSnippet.command}
						{codeSnippet.error && (
							<>
								<br />
								<span className="text-red-500">error:</span> {codeSnippet.error}
							</>
						)}
					</p>
				</div>
			)}

			{actionButton && (
				<Button
					asChild
					size={buttonSize}
					variant={buttonVariant}
					className={buttonGapClass}
				>
					<Link href={actionButton.href}>
						{actionButton.icon}
						{actionButton.label}
					</Link>
				</Button>
			)}
		</div>
	);
}
