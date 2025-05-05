export function Footer() {
	return (
		<footer className="mt-auto border-t border-dashed py-4">
			<div className="container mx-auto px-4">
				<p className="text-center text-muted-foreground text-xs">
					© {new Date().getFullYear()} GitHunter · Find top GitHub talent
				</p>
			</div>
		</footer>
	);
}
