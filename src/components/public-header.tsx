import GitHunterLogo from "@/components/githunter-logo";
import { Github, Menu } from "lucide-react";
import Link from "next/link";

const links = [
	{ href: "/peru", label: "Peru ranking" },
	{ href: "/rankings/peru/rising", label: "Rising" },
	{ href: "/peru#methodology", label: "Methodology" },
];

export function PublicHeader() {
	return (
		<header className="sticky top-0 z-[49] border-border border-b bg-background">
			<div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-8">
					<Link href="/" className="flex items-center gap-2">
						<GitHunterLogo className="size-6" />
						<span className="font-medium text-lg tracking-tight">
							GitHunter
						</span>
					</Link>
					<nav
						aria-label="Primary navigation"
						className="hidden items-center gap-7 lg:flex"
					>
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-muted-foreground text-sm hover:text-foreground"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-2">
					<a
						href="https://github.com/crafter-station/githunter"
						target="_blank"
						rel="noopener noreferrer"
						className="hidden h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-muted sm:inline-flex"
					>
						<Github className="size-4" />
						GitHub
					</a>
					<details className="group relative lg:hidden">
						<summary className="flex size-10 cursor-pointer list-none items-center justify-center rounded-md border [&::-webkit-details-marker]:hidden">
							<Menu className="size-5" />
							<span className="sr-only">Open navigation</span>
						</summary>
						<nav
							aria-label="Mobile navigation"
							className="absolute top-12 right-0 grid w-56 gap-1 rounded-md border bg-background p-2 shadow-lg"
						>
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="rounded px-3 py-2 text-sm hover:bg-muted"
								>
									{link.label}
								</Link>
							))}
							<a
								href="https://github.com/crafter-station/githunter"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded px-3 py-2 text-sm hover:bg-muted sm:hidden"
							>
								GitHub
							</a>
						</nav>
					</details>
				</div>
			</div>
		</header>
	);
}
