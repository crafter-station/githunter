"use client";
import GitHunterLogo from "@/components/githunter-logo";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
	const router = useRouter();

	return (
		<header className="sticky top-0 z-30 border-border border-b border-dashed bg-background">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<GitHunterLogo className="h-6 w-6" />
					<span className="font-medium text-lg tracking-tight">GitHunter</span>
				</div>
				<div className="flex items-center gap-4">
					<Button variant="ghost" className="text-sm">
						About
					</Button>
					<Button variant="ghost" className="text-sm" asChild>
						<Link href="/new">Index Profile</Link>
					</Button>
					<SignedIn>
						<UserButton />
					</SignedIn>
					<SignedOut>
						<Button
							variant="outline"
							className="text-sm"
							onClick={() => router.push("/sign-in")}
						>
							Sign In
						</Button>
					</SignedOut>
				</div>
			</div>
		</header>
	);
}
