"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePageParam } from "../hooks/usePageParam";

/**
 * Purely presentational: takes the current page + total pages, tells you when
 * the user wants to go somewhere else. It doesn't know about TanStack Query,
 * axios, or your proxy route - that separation is what lets you reuse it for
 * order history, admin product lists, etc, not just the product catalog.
 */
type PaginatorProps = {
	pages: number; // total page count, from the backend's `pages` field
	isFetching?: boolean; // optional: dim controls while a page transition is in flight
};

/**
 * Builds the visible page-number sequence with ellipsis gaps, e.g. for page 7 of 20:
 * [1, "...", 6, 7, 8, "...", 20]
 * Always keeps the first page, last page, and a small window around the current page.
 */
function getVisiblePages(page: number, pages: number): (number | "ellipsis")[] {
	const siblingCount = 1;
	const totalVisible = siblingCount * 2 + 5; // first, last, current, 2 siblings, 2 ellipses

	if (pages <= totalVisible) {
		return Array.from({ length: pages }, (_, i) => i + 1);
	}

	const leftSibling = Math.max(page - siblingCount, 1);
	const rightSibling = Math.min(page + siblingCount, pages);

	const showLeftEllipsis = leftSibling > 2;
	const showRightEllipsis = rightSibling < pages - 1;

	const result: (number | "ellipsis")[] = [1];

	if (showLeftEllipsis) result.push("ellipsis");
	for (let p = leftSibling; p <= rightSibling; p++) {
		if (p !== 1 && p !== pages) result.push(p);
	}
	if (showRightEllipsis) result.push("ellipsis");

	result.push(pages);
	return result;
}

export default function Paginator({ pages, isFetching }: PaginatorProps) {
	const [page, setPage] = usePageParam();
	if (pages <= 1) return null;

	const visiblePages = getVisiblePages(page, pages);
	const canGoPrev = page > 1;
	const canGoNext = page < pages;

	const buttonBase =
		"h-11 min-w-11 px-3 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40";

	return (
		<nav
			role="navigation"
			aria-label="Pagination"
			className={`flex items-center justify-center gap-1 col-span-full ${isFetching ? "opacity-60" : ""}`}
		>
			<button
				type="button"
				aria-label="Previous page"
				disabled={!canGoPrev}
				onClick={() => {
					setPage(page - 1);
					window.scrollTo({
						top: 0,
						behavior: "smooth"
					}); // pagination without a scroll-to-top feels broken
				}}
				className={`${buttonBase} border border-input hover:bg-accent hover:text-accent-foreground`}
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			{visiblePages.map((p, idx) =>
				p === "ellipsis" ? (
					<span
						key={`ellipsis-${idx}`}
						aria-hidden="true"
						className="h-11 min-w-11 inline-flex items-center justify-center text-sm text-muted-foreground"
					>
						…
					</span>
				) : (
					<button
						key={idx}
						type="button"
						aria-label={`Page ${p}`}
						aria-current={p === page ? "page" : undefined}
						onClick={() => {
							setPage(p);
							window.scrollTo({
								top: 0,
								behavior: "smooth"
							});
						}}
						className={`${buttonBase} ${
							p === page
								? "bg-black text-white hover:bg-black/90"
								: "border border-input hover:bg-accent hover:text-accent-foreground"
						}`}
					>
						{p}
					</button>
				)
			)}

			<button
				type="button"
				aria-label="Next page"
				disabled={!canGoNext}
				onClick={() => {
					setPage(page + 1);
					window.scrollTo({
						top: 0,
						behavior: "smooth"
					});
				}}
				className={`${buttonBase} border border-input hover:bg-accent hover:text-accent-foreground`}
			>
				<ChevronRight className="h-4 w-4" />
			</button>
		</nav>
	);
}

// SimplePaginator.tsx
interface SimplePaginatorProps {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

export function SimplePaginator({
	totalPages,
	currentPage,
	onPageChange
}: SimplePaginatorProps) {
	const canGoPrev = currentPage > 1;
	const canGoNext = currentPage < totalPages && totalPages > 0;

	const goToPrev = () => {
		if (canGoPrev) {
			onPageChange(currentPage - 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const goToNext = () => {
		if (canGoNext) {
			onPageChange(currentPage + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<div className="flex items-center justify-center gap-3">
			<button
				onClick={goToPrev}
				disabled={!canGoPrev}
				className="disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Previous
			</button>

			<span>
				Page {currentPage} of {totalPages}
			</span>

			<button
				onClick={goToNext}
				disabled={!canGoNext}
				className="disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Next
			</button>
		</div>
	);
}
