"use client";

import GitHunterLogo from "@/components/githunter-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
	ChevronDown,
	CreditCard,
	Crown,
	ExternalLink,
	FileText,
	Layers,
	Settings,
	Telescope,
	User,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { SearchBox } from "./search";
import { UserButton } from "./user-button";

interface HeaderProps {
	noSearch?: boolean;
}

export function Header({ noSearch = false }: HeaderProps) {
	const { user } = useUser();
	const { currentPlan } = useSubscription();

	const getPlanIcon = () => {
		if (!currentPlan) return null;
		switch (currentPlan.name) {
			case "Pro":
				return <Zap className="size-3" />;
			case "Plus":
				return <Crown className="size-3" />;
			default:
				return null;
		}
	};

	const getPlanColor = ():
		| "default"
		| "secondary"
		| "destructive"
		| "outline" => {
		if (!currentPlan) return "secondary";
		switch (currentPlan.name) {
			case "Pro":
				return "default";
			case "Plus":
				return "destructive";
			default:
				return "secondary";
		}
	};

	// Compact version with search bar
	if (!noSearch) {
		return (
			<header className="sticky top-0 z-[49] border-border border-b border-dashed bg-background">
				<div className="mx-auto flex h-12 w-full items-center justify-between px-4 md:h-14 md:px-10">
					<div className="flex w-full items-center gap-2 md:gap-12">
						<Link href="/" className="flex items-center gap-2">
							<div className="rounded-sm border border-border p-1.5">
								<GitHunterLogo className="size-4 " />
							</div>
							<span className="hidden font-medium text-lg tracking-tight md:block">
								GitHunter
							</span>
						</Link>

						<div className="relative max-w-2xl flex-1">
							<SearchBox initialQuery="" variant="compact" />
						</div>
					</div>
					<div className="flex items-center gap-3">
						{user && (
							<>
								{/* Plan Badge - Separate clickable element */}
								<Link
									href={currentPlan ? "/portal" : "/pricing"}
									className="transition-transform hover:scale-105"
								>
									<Badge
										variant={getPlanColor()}
										className={cn(
											"flex cursor-pointer items-center gap-1.5 px-3 py-1.5 font-medium text-xs",
											currentPlan && "shadow-sm",
										)}
									>
										{getPlanIcon()}
										{currentPlan ? currentPlan.name : "Free"}
										{currentPlan && (
											<span className="text-xs opacity-75">
												${currentPlan.price}/mo
											</span>
										)}
									</Badge>
								</Link>

								{/* User Actions Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 transition-colors hover:bg-accent/40"
										>
											<Settings className="size-4 text-muted-foreground" />
											<span className="hidden font-medium text-sm sm:block">
												{user.username}
											</span>
											<ChevronDown className="size-4 text-muted-foreground" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="z-50 w-56" align="end">
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
										<DropdownMenuItem
											asChild
											className="flex cursor-pointer items-center gap-2 px-3 py-2"
										>
											<Link
												href="/cv/edit"
												className="flex w-full items-center"
											>
												<FileText className="mr-2 size-4" />
												<span>Edit CV</span>
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
										<DropdownMenuSeparator />
										<DropdownMenuItem
											asChild
											className="flex cursor-pointer items-center gap-2 px-3 py-2"
										>
											<Link
												href={currentPlan ? "/portal" : "/pricing"}
												className="flex w-full items-center"
											>
												<CreditCard className="mr-2 size-4" />
												<span>
													{currentPlan ? "Manage subscription" : "Upgrade plan"}
												</span>
											</Link>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						)}
						<UserButton />
					</div>
				</div>
			</header>
		);
	}

	// Expanded version without search bar
	return (
		<header className="sticky top-0 z-[49] border-border border-b border-dashed bg-background">
			<div className="mx-auto flex h-12 w-full items-center justify-between px-4 md:h-14 md:px-10">
				<div className="flex items-center gap-8">
					<Link href="/" className="flex items-center gap-2">
						<div className="rounded-sm border border-border p-1.5">
							<GitHunterLogo className="size-4" />
						</div>
						<span className="font-medium text-lg tracking-tight">
							GitHunter
						</span>
					</Link>

					{user && (
						<div className="hidden items-center gap-4 lg:flex">
							{/* All features as direct buttons */}
							<Button variant="ghost" size="sm" asChild>
								<Link
									href="/search/advanced"
									className="flex items-center gap-2"
								>
									<Telescope className="size-4" />
									<span>Advanced Search</span>
								</Link>
							</Button>

							<Button variant="ghost" size="sm" asChild>
								<Link href="/new" className="flex items-center gap-2">
									<Layers className="size-4" />
									<span>Indexer</span>
								</Link>
							</Button>

							<Button variant="ghost" size="sm" asChild>
								<Link href="/cv/edit" className="flex items-center gap-2">
									<FileText className="size-4" />
									<span>CV Editor</span>
								</Link>
							</Button>
						</div>
					)}
				</div>

				<div className="flex items-center gap-3">
					{user && (
						<>
							{/* Plan Badge with upgrade CTA */}
							<Link
								href={currentPlan ? "/portal" : "/pricing"}
								className="transition-transform hover:scale-105"
							>
								<Badge
									variant={getPlanColor()}
									className={cn(
										"flex cursor-pointer items-center gap-2 px-4 py-2 font-medium text-sm",
										currentPlan && "shadow-sm",
										!currentPlan && "animate-pulse",
									)}
								>
									{getPlanIcon()}
									<span>{currentPlan ? currentPlan.name : "Free Plan"}</span>
									{currentPlan ? (
										<span className="text-sm opacity-75">
											${currentPlan.price}/mo
										</span>
									) : (
										<span className="font-semibold text-xs opacity-90">
											Upgrade Now
										</span>
									)}
								</Badge>
							</Link>

							{/* Direct Profile Button */}
							<Button variant="outline" size="sm" asChild>
								<Link
									href={`/developer/${user.username}`}
									className="flex items-center gap-2"
								>
									<User className="size-4" />
									<span className="hidden sm:block">View Profile</span>
									<ExternalLink className="size-3 opacity-60" />
								</Link>
							</Button>
						</>
					)}
					<UserButton />
				</div>
			</div>
		</header>
	);
}
