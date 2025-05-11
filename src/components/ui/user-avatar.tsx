import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserAvatarProps {
	src: string;
	alt: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function UserAvatar({
	src,
	alt,
	size = "md",
	className,
}: UserAvatarProps) {
	const sizeClasses = {
		sm: "h-8 w-8",
		md: "h-10 w-10",
		lg: "h-14 w-14",
	};

	return (
		<Avatar className={cn(sizeClasses[size], className)}>
			<AvatarImage src={src} alt={alt} />
			<AvatarFallback className="bg-muted">
				<User
					className={cn(
						"text-muted-foreground",
						size === "sm" ? "h-4 w-4" : "h-6 w-6",
					)}
				/>
			</AvatarFallback>
		</Avatar>
	);
}
