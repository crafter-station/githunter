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
					This developer is not part of the current public ranking cohort.
				</p>
				<div className="flex gap-4">
					<Button asChild variant="default">
						<Link href="/">Go Home</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/legacy">Legacy tools</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
