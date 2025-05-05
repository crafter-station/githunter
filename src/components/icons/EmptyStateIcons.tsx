export function GitHubSadFaceIcon() {
	return (
		<div className="relative h-48 w-48">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				className="absolute h-full w-full text-muted-foreground/20"
				aria-hidden="true"
			>
				<title>GitHub Logo Background</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
					fill="currentColor"
				/>
			</svg>
			<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 transform">
				<svg
					width="100"
					height="100"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-muted-foreground"
					aria-hidden="true"
				>
					<title>Sad Face Emoji</title>
					<circle cx="12" cy="12" r="10" />
					<path d="M8 15h8" />
					<path d="M9 9h.01" />
					<path d="M15 9h.01" />
				</svg>
			</div>
		</div>
	);
}

export function EmptyRepositoryIcon() {
	return (
		<div className="relative h-20 w-20">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-full w-full text-[#ccc]"
				aria-hidden="true"
			>
				<title>Empty Repository Icon</title>
				<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
				<path d="M16 8 2 22" />
				<path d="M17.5 15H9" />
			</svg>
		</div>
	);
}
