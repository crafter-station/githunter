"use client";

import { Button } from "@/components/ui/button";
import { UserButton as ClerkUserButton, Show } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function UserButton() {
	const router = useRouter();

	return (
		<div className="ml-2 flex items-center gap-4 lg:ml-0">
			<Show when="signed-in">
				<ClerkUserButton />
			</Show>
			<Show when="signed-out">
				<Button
					variant="outline"
					className="text-sm"
					onClick={() => router.push("/sign-in")}
				>
					Sign In
				</Button>
			</Show>
		</div>
	);
}
