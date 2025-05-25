"use client";

import GitHunterLogo from "@/components/githunter-logo";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { ChevronDown, CreditCard, FileText, Layers, User } from "lucide-react";
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
									<ChevronDown className="size-4 text-muted-foreground" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="z-50 w-56" align="end">
								<DropdownMenuItem
									asChild
									className="flex cursor-pointer items-center gap-2 px-3 py-2"
								>
									<Link
										href={currentPlan ? "/portal" : "/pricing"}
										className="flex w-full items-center"
									>
										<CreditCard className="mr-2 size-4" />
										<span>Manage subscription</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									asChild
									className="flex cursor-pointer items-center gap-2 px-3 py-2"
								>
									<Link
										href={`/developer/${user.username}`}
										className="flex w-full items-center"
									>
										<User className="mr-2 size-4" />
										<span>View profile</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									asChild
									className="flex cursor-pointer items-center gap-2 px-3 py-2"
								>
									<Link href="/new" className="flex w-full items-center">
										<Layers className="mr-2 size-4" />
										<span>Indexer</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									asChild
									className="flex cursor-pointer items-center gap-2 px-3 py-2"
								>
									<Link href="/cv" className="flex w-full items-center">
										<FileText className="mr-2 size-4" />
										<span>CV</span>
									</Link>
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
