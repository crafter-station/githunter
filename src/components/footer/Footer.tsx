import Link from "next/link";

export function Footer() {
	return (
		<footer className="mt-auto border-border border-t border-dashed py-8">
			<div className="container mx-auto flex items-center justify-center gap-6">
				<Link
					href="/about"
					className="text-muted-foreground text-sm hover:text-primary"
				>
					About
				</Link>
				<Link
					href="/pricing"
					className="text-muted-foreground text-sm hover:text-primary"
				>
					Pricing
				</Link>
				<a
					href="https://github.com/crafter-station/githunter"
					rel="noopener noreferrer"
					target="_blank"
					className="text-muted-foreground text-sm hover:text-primary"
				>
					GitHub
				</a>
				<a
					href="https://www.linkedin.com/company/crafter-station"
					rel="noopener noreferrer"
					target="_blank"
					className="text-muted-foreground text-sm hover:text-primary"
				>
					LinkedIn
				</a>
				<a
					href="https://discord.gg/7MfrzBAX"
					rel="noopener noreferrer"
					target="_blank"
					className="text-muted-foreground text-sm hover:text-primary"
				>
					Discord
				</a>
			</div>
		</footer>
	);
}
