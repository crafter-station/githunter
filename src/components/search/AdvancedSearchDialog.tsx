"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdvancedSearchDialogProps {
	variant?: "outline" | "ghost";
}

export function AdvancedSearchDialog({
	variant = "outline",
}: AdvancedSearchDialogProps) {
	const router = useRouter();

	const handleClick = () => {
		router.push("/search/advanced");
	};

	return (
		<Button variant={variant} className="w-max gap-2" onClick={handleClick}>
			<Sparkles className="h-4 w-4" />
		</Button>
	);
}
