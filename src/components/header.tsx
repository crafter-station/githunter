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
	ArrowRight,
	Bug,
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

	const getPlanClassNames = () => {
		if (!currentPlan)
			return "bg-stone-200 text-stone-700 shadow-lg border-b-4 border-stone-300 hover:bg-stone-300 hover:border-stone-400  active:translate-y-1 active:border-b-2 transition-all";
		switch (currentPlan.name) {
			case "Pro":
				return "bg-blue-500 text-white shadow-lg border-b-4 border-blue-700 hover:bg-blue-600 hover:border-blue-800 active:translate-y-1 active:border-b-2 transition-all";
			case "Plus":
				return "bg-gradient-to-t from-orange-600 to-orange-400 text-white shadow-lg border-b-4 border-orange-700 hover:from-orange-700 hover:to-orange-500 hover:border-orange-800 active:translate-y-1 active:border-b-2 transition-all";
			default:
				return "bg-slate-300 text-slate-700 shadow-lg border-b-4 border-slate-400 hover:bg-slate-400 hover:border-slate-500 active:translate-y-1 active:border-b-2 transition-all";
		}
	};

	// Compact version with search bar
	if (!noSearch) {
		return (
			<header className="sticky top-0 z-[49] border-border border-b border-dashed bg-background">
				<div className="mx-auto flex h-12 w-full items-center justify-between px-4 md:h-14 md:px-10">
					<div className="flex w-full items-center gap-2 md:gap-12">
						<Link href="/" className="flex items-center gap-2">
							<div className="rounded-sm border border-border p-2 md:p-1.5">
								<GitHunterLogo className="size-5 md:size-4" />
							</div>
							<span className="hidden font-medium text-lg tracking-tight md:block">
								GitHunter
							</span>
						</Link>

						<div className="relative max-w-2xl flex-1">
							<SearchBox initialQuery="" variant="compact" />
						</div>
					</div>
					<div className="flex items-center gap-2 sm:gap-3">
						{user && (
							<>
								{/* Bug Report Button - visible only on desktop */}
								<Button
									variant="outline"
									size="sm"
									asChild
									className="hidden md:flex"
								>
									<Link
										href="https://github.com/crafter-station/githunter/issues/new?template=feature---issue-request.md"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2"
									>
										<Bug className="size-4" />
										<span>Report Bug</span>
										<ExternalLink className="size-3 opacity-60" />
									</Link>
								</Button>

								{/* Plan Badge - visible only on desktop */}
								<Link
									href={currentPlan ? "/portal" : "/pricing"}
									className="hidden transition-transform hover:scale-105 md:block"
								>
									<Badge
										className={cn(
											"flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 font-semibold text-xs",
											getPlanClassNames(),
										)}
									>
										{getPlanIcon()}
										{currentPlan ? `${currentPlan.name} Plan` : "Free Plan"}
									</Badge>
								</Link>

								{/* User Actions Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button
											type="button"
											className="ml-2 flex items-center gap-1 rounded-md border border-border bg-background px-2 py-2.5 transition-colors hover:bg-accent/40 sm:gap-2 sm:px-3 md:py-1.5"
										>
											<Settings className="size-4 text-muted-foreground" />
											<span className="hidden font-medium text-sm sm:block">
												{user.username}
											</span>
											<ChevronDown className="size-4 text-muted-foreground" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="z-50 w-56" align="end">
										{/* Plan Badge in dropdown - only visible on mobile */}
										<DropdownMenuItem
											asChild
											className="flex cursor-pointer items-center gap-2 px-3 py-2 md:hidden"
										>
											<Link
												href={currentPlan ? "/portal" : "/pricing"}
												className="flex w-full items-center"
											>
												{getPlanIcon()}
												<span className="ml-2">Your plan</span>
												<Badge
													className={cn(
														"ml-auto flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 font-semibold text-xs",
														getPlanClassNames(),
													)}
												>
													{currentPlan ? currentPlan.name : "Free"}
												</Badge>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator className="md:hidden" />
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
												href="https://github.com/crafter-station/githunter/issues/new?template=feature---issue-request.md"
												target="_blank"
												rel="noopener noreferrer"
												className="flex w-full items-center"
											>
												<Bug className="mr-2 size-4" />
												<span>Report Bug</span>
												<ExternalLink className="ml-auto size-3 opacity-60" />
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											asChild
											className="flex cursor-pointer items-center gap-2 px-3 py-2"
										>
											<Link
												href="/search/advanced"
												className="flex w-full items-center"
											>
												<Telescope className="mr-2 size-4" />
												<span>Advanced Search</span>
											</Link>
										</DropdownMenuItem>
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
											<Link
												href="/cv/edit"
												className="flex w-full items-center"
											>
												<FileText className="mr-2 size-4" />
												<span>CV Editor</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											asChild
											className={cn(
												"flex cursor-pointer items-center gap-2 px-3 py-2",
												!currentPlan &&
													"bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50",
											)}
										>
											<Link
												href={currentPlan ? "/portal" : "/pricing"}
												className="flex w-full items-center"
											>
												{currentPlan ? (
													<>
														<CreditCard className="mr-2 size-4" />
														<span>Manage subscription</span>
													</>
												) : (
													<>
														<Crown className="mr-2 size-4 text-orange-600" />
														<span className="font-semibold text-orange-600">
															Upgrade to
														</span>
														<Badge className="ml-auto rounded-md border-orange-700 border-b-4 bg-gradient-to-t from-orange-600 to-orange-400 px-2 py-0.5 font-semibold text-white text-xs shadow-lg">
															PLUS
														</Badge>
													</>
												)}
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

					<div className="hidden items-center gap-4 lg:flex">
						{/* All features as direct buttons */}
						<Button variant="ghost" size="sm" asChild>
							<Link href="/search/advanced" className="flex items-center gap-2">
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

						<Button variant="ghost" size="sm" asChild>
							<Link
								href="https://github.com/crafter-station/githunter/issues/new?template=feature---issue-request.md"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								<Bug className="size-4" />
								<span>Report Bug</span>
								<ExternalLink className="size-3 opacity-60" />
							</Link>
						</Button>
					</div>
				</div>

				<div className="flex items-center gap-2 sm:gap-3">
					{user && (
						<>
							{/* Plan Badge with upgrade CTA */}
							<Link
								href={currentPlan ? "/portal" : "/pricing"}
								className="transition-transform hover:scale-105"
							>
								<Badge
									className={cn(
										"flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 font-semibold text-xs sm:gap-2 sm:rounded-lg sm:px-3 sm:text-sm",
										getPlanClassNames(),
									)}
								>
									{getPlanIcon()}
									<span className="hidden sm:inline">
										{currentPlan ? `${currentPlan.name} Plan` : "Free Plan"}
									</span>
									<span className="sm:hidden">
										{currentPlan ? currentPlan.name : "Free"}
									</span>
									{!currentPlan && (
										<span className="hidden items-center gap-1 font-semibold text-xs opacity-90 md:flex">
											<ArrowRight className="size-4" />
											Upgrade Now
										</span>
									)}
								</Badge>
							</Link>

							{/* Direct Profile Button */}
							<Button variant="outline" size="sm" asChild>
								<Link
									href={`/developer/${user.username}`}
									className="flex items-center gap-1 px-2 sm:gap-2 sm:px-3"
								>
									<User className="size-4" />
									<span className="hidden sm:block">Profile</span>
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
