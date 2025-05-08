"use client";

import { Button } from "@/components/ui/button";
import {
	UserButton as ClerkUserButton,
	SignedIn,
	SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function UserButton() {
	const router = useRouter();

	return (
		<div className="ml-2 flex items-center gap-4 lg:ml-0">
			<SignedIn>
				<ClerkUserButton />
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
	);
}
