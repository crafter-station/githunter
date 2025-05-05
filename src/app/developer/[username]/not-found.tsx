import { Button } from "@/components/ui/button";
import { GhostIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-[80vh] flex-col items-center justify-center">
			<div className="flex flex-col items-center text-center">
				<div className="mb-5 rounded-full bg-muted p-6">
					<GhostIcon className="h-12 w-12 text-muted-foreground" />
				</div>
				<h1 className="mb-2 font-bold text-4xl">User Not Found</h1>
				<p className="mb-8 max-w-md text-muted-foreground">
					The GitHub user you're looking for doesn't exist in our database or
					hasn't been indexed yet.
				</p>
				<div className="flex gap-4">
					<Button asChild variant="default">
						<Link href="/">Go Home</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/new">Add a GitHub User</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
