"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackToSearchButton() {
	const router = useRouter();

	return (
		<Button
			variant="link"
			onClick={() => router.back()}
			className="flex items-center gap-1 p-0 text-blue-600 text-sm hover:underline dark:text-blue-400"
		>
			<ArrowLeft className="h-3 w-3" />
			Modify search
		</Button>
	);
}
