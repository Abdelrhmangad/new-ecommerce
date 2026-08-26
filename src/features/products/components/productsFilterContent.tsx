"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useProductsCategories } from "../../../shared/services/categories.queries";
import { SingleCategoryType } from "../../../shared/types/Categories.types";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductsFilterContent() {
	const t = useTranslations("Products");
	const locale = useLocale() as "en" | "ar";
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { data: categoriesData, isPending } = useProductsCategories();

	// Derive initial filter values from URL
	const initialCategories =
		searchParams.get("categories")?.split(",").filter(Boolean) || [];
	const initialSizes =
		searchParams.get("sizes")?.split(",").filter(Boolean) || [];
	const initialSort =
		(searchParams.get("sort") as "featured" | "low-high" | "high-low") ||
		"featured";

	// Local state (only updated by user interactions, not directly by URL changes)
	const [selectedCategories, setSelectedCategories] =
		useState<string[]>(initialCategories);
	const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);
	const [sortBy, setSortBy] = useState<"featured" | "low-high" | "high-low">(
		initialSort
	);

	// Helper to update the URL with given filter values
	const updateUrlFilters = (
		categories: string[],
		sizes: string[],
		sort: string
	) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", `1`);
		if (categories.length > 0) {
			params.set("categories", categories.join(","));
		} else {
			params.delete("categories");
		}

		if (sizes.length > 0) {
			params.set("sizes", sizes.join(","));
		} else {
			params.delete("sizes");
		}

		if (sort !== "featured") {
			params.set("sort", sort);
		} else {
			params.delete("sort");
		}

		const newUrl = `${pathname}?${params.toString()}`;
		router.push(newUrl, { scroll: false });
	};

	// Toggle handlers (update local state only)
	const toggleCategory = (cat: string) => {
		setSelectedCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
		);
	};

	const toggleSize = (size: string) => {
		setSelectedSizes((prev) =>
			prev.includes(size)
				? prev.filter((s) => s !== size)
				: [...prev, size]
		);
	};

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSortBy(e.target.value as "featured" | "low-high" | "high-low");
	};

	// Apply filters: push current local state to URL
	const handleApplyFilters = () => {
		updateUrlFilters(selectedCategories, selectedSizes, sortBy);
	};

	// Clear filters: reset local state and remove all filter params from URL
	const handleClearFilters = () => {
		setSelectedCategories([]);
		setSelectedSizes([]);
		setSortBy("featured");
		updateUrlFilters([], [], "featured");
	};

	// Check if any filter is active (for button states)
	const hasActiveFilters =
		selectedCategories.length > 0 || selectedSizes.length > 0;

	return (
		<div className="space-y-6">
			{/* Category Filter */}
			<div>
				<h3 className="text-sm font-semibold mb-3">
					{t("categories")}
				</h3>
				<div className="space-y-2">
					{isPending ? (
						<p className="text-sm text-muted-foreground">
							Loading...
						</p>
					) : (
						categoriesData?.map((category: SingleCategoryType) => (
							<label
								key={category._id}
								className="flex items-center gap-2 text-sm cursor-pointer"
							>
								<Checkbox
									checked={selectedCategories.includes(
										category.slug
									)}
									onCheckedChange={() =>
										toggleCategory(category.slug)
									}
								/>
								<span>{category.name[locale]}</span>
							</label>
						))
					)}
				</div>
			</div>

			<hr />

			{/* Size Filter */}
			<div>
				<h3 className="text-sm font-semibold mb-3">{t("size")}</h3>
				<div className="flex flex-wrap gap-2">
					{SIZES.map((size) => (
						<button
							key={size}
							onClick={() => toggleSize(size)}
							className={`h-8 w-8 rounded border text-xs font-medium transition-colors ${
								selectedSizes.includes(size)
									? "border-primary bg-primary text-primary-foreground"
									: "hover:border-primary/50"
							}`}
						>
							{size}
						</button>
					))}
				</div>
			</div>

			<hr />

			{/* Sort Dropdown */}
			<div>
				<h3 className="text-sm font-semibold mb-3">{t("sortBy")}</h3>
				<select
					value={sortBy}
					onChange={handleSortChange}
					className="h-9 rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
				>
					<option value="featured">{t("new")}</option>
					<option value="low-high">{t("priceFromLowToHigh")}</option>
					<option value="high-low">{t("priceHighToLow")}</option>
				</select>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-2 items-center flex-wrap justify-between">
				<Button
					size="lg"
					onClick={handleApplyFilters}
					className="w-full shrink text-sm gap-1 py-5"
				>
					{t("applyFilters")}
				</Button>
				<Button
					variant="outline"
					size="lg"
					onClick={handleClearFilters}
					className="w-full shrink text-sm gap-1 py-5"
					disabled={!hasActiveFilters}
				>
					<X className="h-3 w-3" /> Clear Filters
				</Button>
			</div>
		</div>
	);
}
