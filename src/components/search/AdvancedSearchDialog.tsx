"use client";

import { Button } from "@/components/ui/button";
import { TelescopeIcon } from "lucide-react";
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
		<Button
			variant={variant}
			className="group hidden size-7 w-max gap-2 rounded-full md:flex"
			onClick={handleClick}
		>
			<TelescopeIcon className="group-hover:!text-foreground h-4 w-4 text-muted-foreground" />
		</Button>
	);
}
