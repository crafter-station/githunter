import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	baseUrl: string;
	firstPageUrl: string;
	maxItems?: number;
}

export function Pagination({
	currentPage,
	totalPages,
	baseUrl,
	maxItems = 5,
	firstPageUrl,
}: PaginationProps) {
	// Only show pagination if there's more than one page
	if (totalPages <= 1) {
		return null;
	}

	// Calculate the range of visible page numbers
	const getVisiblePageNumbers = () => {
		const items: (number | "ellipsis")[] = [];
		const halfMaxItems = Math.floor(maxItems / 2);

		// Always include page 1
		items.push(1);

		if (totalPages <= maxItems) {
			// If total pages is less than max items, show all pages
			for (let i = 2; i <= totalPages; i++) {
				items.push(i);
			}
		} else {
			// Add ellipsis if needed
			if (currentPage > halfMaxItems + 1) {
				items.push("ellipsis");
			}

			// Calculate start and end of the middle range
			let startPage = Math.max(2, currentPage - halfMaxItems + 1);
			let endPage = Math.min(totalPages - 1, currentPage + halfMaxItems - 1);

			// Ensure we show the correct number of pages
			if (startPage > 2) {
				startPage = Math.max(2, endPage - maxItems + 3);
			}

			if (endPage < totalPages - 1) {
				endPage = Math.min(totalPages - 1, startPage + maxItems - 3);
			}

			// Add the middle range of pages
			for (let i = startPage; i <= endPage; i++) {
				items.push(i);
			}

			// Add ellipsis if needed
			if (currentPage < totalPages - halfMaxItems) {
				items.push("ellipsis");
			}

			// Always include the last page if it's not already included
			if (endPage < totalPages) {
				items.push(totalPages);
			}
		}

		return items;
	};

	const visiblePageNumbers = getVisiblePageNumbers();

	return (
		<nav aria-label="Pagination" className="mx-auto flex w-full justify-center">
			<ul className="flex items-center gap-1">
				{/* Previous page button */}
				<li>
					<Link
						href={
							currentPage > 2 ? `${baseUrl}/${currentPage - 1}` : firstPageUrl
						}
						aria-disabled={currentPage <= 1}
						className={cn(
							buttonVariants({ variant: "outline", size: "icon" }),
							"h-8 w-8",
							currentPage <= 1 && "pointer-events-none opacity-50",
						)}
						aria-label="Go to previous page"
					>
						<ChevronLeft className="h-4 w-4" />
					</Link>
				</li>

				{/* Page numbers */}
				{visiblePageNumbers.map((page, index) => {
					if (page === "ellipsis") {
						return (
							<li
								key={`ellipsis-${index === 0 ? "start" : "end"}`}
								className="flex items-center justify-center"
							>
								<span className="flex h-8 w-8 items-center justify-center text-muted-foreground text-sm">
									<MoreHorizontal className="h-4 w-4" />
								</span>
							</li>
						);
					}

					if (page === 1) {
						return (
							<li key={1}>
								<Link
									href={firstPageUrl}
									className={cn(
										buttonVariants({
											variant: page === currentPage ? "default" : "outline",
										}),
										"h-8 w-8 p-0",
										page === currentPage && "pointer-events-none",
									)}
								>
									<span>{page}</span>
								</Link>
							</li>
						);
					}

					return (
						<li key={page}>
							<Link
								href={`${baseUrl}/${page}`}
								className={cn(
									buttonVariants({
										variant: page === currentPage ? "default" : "outline",
									}),
									"h-8 w-8 p-0",
									page === currentPage && "pointer-events-none",
								)}
								aria-label={`Page ${page}`}
								aria-current={page === currentPage ? "page" : undefined}
							>
								<span>{page}</span>
							</Link>
						</li>
					);
				})}

				{/* Next page button */}
				<li>
					<Link
						href={
							currentPage < totalPages ? `${baseUrl}/${currentPage + 1}` : "#"
						}
						aria-disabled={currentPage >= totalPages}
						className={cn(
							buttonVariants({ variant: "outline", size: "icon" }),
							"h-8 w-8",
							currentPage >= totalPages && "pointer-events-none opacity-50",
						)}
						aria-label="Go to next page"
					>
						<ChevronRight className="h-4 w-4" />
					</Link>
				</li>
			</ul>
		</nav>
	);
}
