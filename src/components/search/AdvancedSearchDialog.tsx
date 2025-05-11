"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdvancedSearchDialog() {
	const router = useRouter();

	const handleClick = () => {
		router.push("/search/advanced");
	};

	return (
		<Button variant="outline" className="w-max gap-2" onClick={handleClick}>
			<Sparkles className="h-4 w-4" />
		</Button>
	);
}
