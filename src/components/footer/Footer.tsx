import { cn } from "@/lib/utils";
import Link from "next/link";
import { CrafterIcon } from "../icons/crafter";
import shellStyles from "../public-shell.module.css";

interface FooterProps {
	className?: string;
}

export function Footer({ className }: FooterProps) {
	return (
		<footer className={cn("mt-auto py-10", className)}>
			<div
				className={`${shellStyles.shell} flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}
			>
				<a
					href="https://crafter-station.com"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-3 text-muted-foreground text-sm hover:text-foreground"
				>
					<CrafterIcon size={32} className="shrink-0" />
					<span>An initiative by Crafter Station</span>
				</a>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
					<Link
						href="/peru#methodology"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						Methodology
					</Link>
					<a
						href="/api/rankings/peru/balanced"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						Reproducible JSON
					</a>
					<Link
						href="/rankings/peru/rising"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						Rising ranking
					</Link>
					<a
						href="https://github.com/crafter-station/githunter"
						rel="noopener noreferrer"
						target="_blank"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						GitHub
					</a>
					<Link
						href="/legacy"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						Legacy tools
					</Link>
				</div>
			</div>
		</footer>
	);
}
