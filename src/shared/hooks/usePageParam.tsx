"use client";

/**
 * Reads the current page from the `?page=` URL param and gives you a setter that
 * updates the URL (merging with any other existing params like ?category=, ?size=,
 * so pagination doesn't wipe your filters). Uses router.replace + { scroll: false }
 * rather than router.push, so clicking through pages doesn't flood the browser's
 * back-button history with one entry per page - back should take you to the page
 * you were on before you started browsing the catalog, not through every page click.
 *
 * NOTE: if your project uses next-intl's locale-aware routing wrappers (the ones
 * your Navbar already imports from "@/i18n/routing" per your project setup), swap
 * these two imports for that module's usePathname/useRouter instead of next/navigation.
 * The API is identical - it's a drop-in replacement, everything below stays the same.
 */

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function usePageParam(defaultPage = 1) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const page = useMemo(() => {
		const raw = searchParams.get("page");
		const parsed = raw ? parseInt(raw, 10) : defaultPage;
		return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultPage;
	}, [searchParams, defaultPage]);

	const setPage = useCallback(
		(newPage: number) => {
			const params = new URLSearchParams(searchParams.toString());

			if (newPage <= 1) {
				params.delete("page"); // page 1 is the default - keep the URL clean, no "?page=1"
			} else {
				params.set("page", String(newPage));
			}

			const query = params.toString();
			router.replace(`${pathname}${query ? `?${query}` : ""}`, {
				scroll: false
			});
		},
		[pathname, router, searchParams]
	);

	return [page, setPage] as const;
}
