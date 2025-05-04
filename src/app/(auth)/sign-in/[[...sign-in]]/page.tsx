import GitHunterLogo from "@/components/githunter-logo";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="relative flex min-h-screen flex-col-reverse md:flex-row">
			{/* Left side - Sign In */}
			<div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:w-1/2 md:p-8">
				<div className="flex flex-col items-center space-y-4 text-center">
					<div className="rounded-lg border border-border bg-background p-2">
						<GitHunterLogo className="h-6 w-6" />
					</div>
					<SignIn />
				</div>
			</div>

			{/* Right side - Gradient */}
			<div className="w-full bg-gradient-to-br from-primary/20 via-primary/10 to-background md:w-1/2" />
		</div>
	);
}
