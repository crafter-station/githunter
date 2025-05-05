import "flag-icons/css/flag-icons.min.css";

interface CountryFlagProps {
	countryCode: string;
	className?: string;
	size?: "sm" | "md" | "lg";
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
}: CountryFlagProps) {
	const code = countryCode.toLowerCase();

	return (
		<span
			className={`fi fi-${code} ${sizeMap[size]} ${className}`}
			role="img"
			aria-label={`Flag of ${countryCode}`}
		/>
	);
}
