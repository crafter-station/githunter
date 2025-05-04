"use client";
import GitHunterLogo from "@/components/githunter-logo";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
	const router = useRouter();

	return (
		<header className="sticky top-0 z-[100] border-border border-b border-dashed bg-background bg-background">
			<div className="container mx-auto flex h-12 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2">
						<div className="rounded-sm border border-border p-1.5">
							<GitHunterLogo className="size-4 " />
						</div>
						<span className="font-medium text-lg tracking-tight">
							GitHunter
						</span>
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<SignedIn>
						<UserButton showName={true} />
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
