import GitHunterLogo from "@/components/githunter-logo";
import { getUserByUsername } from "@/db/query/user";
import { currentUser } from "@clerk/nextjs/server";
import { User as UserIcon, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton } from "./user-button";

export async function Header() {
	const clerkUser = await currentUser();
	const githubUser = await getUserByUsername(clerkUser?.username);

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
					{githubUser ? (
						<Link href={`/developer/${githubUser.username}`}>
							<Button variant="outline" className="cursor-pointer">
								<UserIcon className="size-4" />
								{githubUser.username}
							</Button>
						</Link>
					) : (
						<Link href="/new">
							<Button variant="outline" className="cursor-pointer">
								<UserPlus className="size-4" />
								Index Profile
							</Button>
						</Link>
					)}
					<UserButton />
				</div>
			</div>
		</header>
	);
}
