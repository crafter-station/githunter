import "flag-icons/css/flag-icons.min.css";

interface CountryFlagProps {
	countryCode: string;
	className?: string;
	size?: "sm" | "md" | "lg";
	decorative?: boolean;
}

const sizeMap = {
	sm: "w-4 h-3",
	md: "w-5 h-4",
	lg: "w-6 h-5",
};

export function CountryFlag({
	countryCode,
	className = "",
	size = "sm",
	decorative = false,
}: CountryFlagProps) {
	const code = countryCode.toLowerCase();

	return (
		<span
			className={`fi fi-${code} ${sizeMap[size]} ${className}`}
			role={decorative ? undefined : "img"}
			aria-hidden={decorative || undefined}
			aria-label={decorative ? undefined : `Flag of ${countryCode}`}
		/>
	);
}
