"use client";

import GitHunterLogo from "@/components/githunter-logo";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubscription } from "@/lib/hooks/useSuscription";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { SearchBox } from "./search";
import { UserButton } from "./user-button";
interface HeaderProps {
	noSearch?: boolean;
}

export function Header({ noSearch = false }: HeaderProps) {
	const { user } = useUser();

	const { currentPlan } = useSubscription();

	return (
		<header className="sticky top-0 z-[49] border-border border-b border-dashed bg-background">
			<div className="mx-auto flex h-12 w-full items-center justify-between px-4 md:h-18 md:px-10">
				<div className="flex w-full items-center gap-2 md:gap-12">
					<Link href="/" className="flex items-center gap-2">
						<div className="rounded-sm border border-border p-1.5">
							<GitHunterLogo className="size-4 " />
						</div>
						{/* If no search, then show GitHunter always */}
						<span
							className={cn(
								"font-medium text-lg tracking-tight",
								!noSearch && "hidden md:block",
							)}
						>
							GitHunter
						</span>
					</Link>

					{!noSearch && (
						<div className="relative max-w-2xl flex-1">
							<SearchBox initialQuery="" variant="compact" />
						</div>
					)}
				</div>
				<div className="flex items-center gap-4">
					{user && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:bg-accent/40"
								>
									<span className="font-medium">{user.username}</span>
									{currentPlan && (
										<Badge
											variant="secondary"
											className="ml-1 px-2 py-0.5 text-xs"
										>
											{currentPlan.name}
										</Badge>
									)}
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="z-50" align="end">
								<DropdownMenuItem asChild>
									<Link
										target="_blank"
										href={currentPlan ? "/portal" : "/pricing"}
									>
										Manage subscription
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href={`/developer/${user.username}`}>View profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/new">Indexer</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
					<UserButton />
				</div>
			</div>
		</header>
	);
}
