"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "@/shared/components/productCard";
import ProductsFilterContent from "@/shared/components/productsFilterContent";
import { DUMMY_PRODUCTS } from "@/shared/data/products.data";

export default function ProductsPage() {
	const locale = useLocale() as "en" | "ar";
	const t = useTranslations("Products");

	// Filter States
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

	const clearFilters = () => {
		setSelectedCategories([]);
		setSelectedSizes([]);
	};

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
		});
	}, [selectedCategories, selectedSizes]);

	return (
		<main className="container mx-auto py-8">
			{/* Header & Controls Bar */}
			<div className="md:hidden flex gap-4 flex-row md:items-center md:justify-between mb-6 pb-4 border-b">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						{t("title")}
					</h1>
					<p className="text-xs text-muted-foreground mt-1">
						Showing {filteredProducts.length} items
					</p>
				</div>

				<div className="flex items-center gap-3 ms-auto justify-end">
					{/* Mobile Filter Sheet Trigger */}
					<Sheet>
						<SheetTrigger className="flex items-center border py-2 px-3 border-black gap-2">
							<SlidersHorizontal className="h-4 w-4" />
							{t("filters")}
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
							<SheetHeader className="mb-4 px-0 pt-0">
								<SheetTitle className="text-base">
									{t("filterProducts")}
								</SheetTitle>
							</SheetHeader>
							<ProductsFilterContent
								clearFilters={clearFilters}
							/>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			{/* Main Catalog Section */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* Desktop Sidebar (Left) */}
				<aside className="hidden md:block col-span-1">
					<div className="mb-6 pb-4 border-b">
						<h1 className="text-2xl font-bold tracking-tight">
							{t("title")}
						</h1>
						<p className="text-xs text-muted-foreground mt-1">
							Showing {filteredProducts.length} items
						</p>
					</div>
					<div className="sticky top-20">
						<ProductsFilterContent clearFilters={clearFilters} />
					</div>
				</aside>

				{/* Product Grid (Right) */}
				<section className="col-span-1 md:col-span-3">
					{filteredProducts.length > 0 ? (
						<div className="grid min-[500px]:grid-cols-2 lg:grid-cols-3 gap-4">
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
