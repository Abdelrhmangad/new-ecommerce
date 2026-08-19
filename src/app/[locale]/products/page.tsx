"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/shared/components/productCard";
import { DUMMY_PRODUCTS } from "@/shared/data/products.data";
import ProductsFilterContent from "@/shared/components/productsFilterContent";

export default function ProductsPage() {
	const locale = useLocale() as "en" | "ar";
	const t = useTranslations("Products");

	// Filter States
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<"featured" | "low-high" | "high-low">(
		"featured"
	);

	const clearFilters = () => {
		setSelectedCategories([]);
		setSelectedSizes([]);
	};

	// Filter & Sort Logic
	const filteredProducts = useMemo(() => {
		return DUMMY_PRODUCTS.filter((product) => {
			// Category Match
			if (
				selectedCategories.length > 0 &&
				!selectedCategories.includes(product.category.en)
			) {
				return false;
			}
			// Size Match
			if (
				selectedSizes.length > 0 &&
				!product.sizes.some((s) => selectedSizes.includes(s))
			) {
				return false;
			}
			return true;
		}).sort((a, b) => {
			if (sortBy === "low-high") return a.price - b.price;
			if (sortBy === "high-low") return b.price - a.price;
			return 0;
		});
	}, [selectedCategories, selectedSizes, sortBy]);

	return (
		<main className="container mx-auto max-w-7xl px-4 py-8">
			{/* Header & Controls Bar */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						{t("title")}
					</h1>
					<p className="text-xs text-muted-foreground mt-1">
						Showing {filteredProducts.length} items
					</p>
				</div>

				<div className="flex items-center gap-3 justify-between md:justify-end">
					{/* Mobile Filter Sheet Trigger */}
					<Sheet>
						<SheetTrigger className="md:hidden gap-2">
							<SlidersHorizontal className="h-4 w-4" />
							Filters
							{(selectedCategories.length > 0 ||
								selectedSizes.length > 0) && (
								<Badge className="ms-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
									{selectedCategories.length +
										selectedSizes.length}
								</Badge>
							)}
						</SheetTrigger>
						<SheetContent
							side={locale === "ar" ? "right" : "left"}
							className="w-80 p-6"
						>
							<SheetHeader className="mb-4">
								<SheetTitle>Filter Products</SheetTitle>
							</SheetHeader>
							<ProductsFilterContent
								clearFilters={clearFilters}
							/>
						</SheetContent>
					</Sheet>

					{/* Sort Dropdown */}
					<select
						value={sortBy}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setSortBy(
								e.target.value as
									| "featured"
									| "low-high"
									| "high-low"
							)
						}
						className="h-9 rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
					>
						<option value="featured">Sort by: Featured</option>
						<option value="low-high">Price: Low to High</option>
						<option value="high-low">Price: High to Low</option>
					</select>
				</div>
			</div>

			{/* Main Catalog Section */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* Desktop Sidebar (Left) */}
				<aside className="hidden md:block col-span-1">
					<div className="sticky top-20">
						<ProductsFilterContent clearFilters={clearFilters} />
					</div>
				</aside>

				{/* Product Grid (Right) */}
				<section className="col-span-1 md:col-span-3">
					{filteredProducts.length > 0 ? (
						<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
							{filteredProducts.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/20">
							<p className="text-muted-foreground text-sm">
								No products match your filters.
							</p>
							<Button
								variant="link"
								onClick={clearFilters}
								className="mt-2 text-xs"
							>
								Clear all filters
							</Button>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
