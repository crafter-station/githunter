"use client";

import GitHunterLogo from "@/components/githunter-logo";
import { useUser } from "@clerk/nextjs";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton } from "./user-button";

export function Header() {
	const { user } = useUser();

	return (
		<header className="sticky top-0 z-[100] border-border border-b border-dashed bg-background">
			<div className="container mx-auto flex h-12 items-center justify-between px-4 md:h-18">
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
					{user && (
						<Link href={`/developer/${user.username}`}>
							<Button variant="outline" className="cursor-pointer">
								<UserIcon className="size-4" />
								{user.username}
							</Button>
						</Link>
					)}
					<UserButton />
				</div>
			</div>
		</header>
	);
}
