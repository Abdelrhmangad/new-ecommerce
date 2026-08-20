"use client";

import { useState } from "react";
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
import { LoaderCircle, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/shared/components/productCard";
import ProductsFilterContent from "@/shared/components/productsFilterContent";
import { useCategoryProducts } from "@/shared/services/products.queries";
import { ProductPropType } from "@/shared/types/Product.types";
import Paginator from "@/shared/components/paginator";
import { useSearchParams } from "next/navigation";

export default function ProductsClient() {
	const locale = useLocale() as "en" | "ar";
	const t = useTranslations("Products");
	const params = useSearchParams();
	console.log("params", params.get("page"));
	const {
		data: productsData,
		isFetching,
		isPending
	} = useCategoryProducts({ page: parseInt(params.get("page") || "") || 1 });
	const products = productsData?.products;
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

	const clearFilters = () => {
		setSelectedCategories([]);
		setSelectedSizes([]);
	};

	return (
		<main className="container mx-auto py-8 min-h-[70dvh]">
			<div className="md:hidden flex gap-4 flex-row md:items-center md:justify-between mb-6 pb-4 border-b">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						{t("title")}
					</h1>
					<p className="text-xs text-muted-foreground mt-1">
						Showing {products?.length} items
					</p>
				</div>

				<div className="flex items-center gap-3 ms-auto justify-end">
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

			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<aside className="hidden md:block col-span-1">
					<div className="mb-6 pb-4 border-b">
						<h1 className="text-2xl font-bold tracking-tight">
							{t("title")}
						</h1>
						<p className="text-xs text-muted-foreground mt-1">
							Showing {products?.length} items
						</p>
					</div>
					<div className="sticky top-20">
						<ProductsFilterContent clearFilters={clearFilters} />
					</div>
				</aside>

				{isPending ? (
					<section className="col-span-1 md:col-span-3">
						<div className="flex items-center justify-center gap-2 py-16 border rounded-lg bg-muted/20">
							<LoaderCircle className="animate-spin stroke-gray-500 w-5 h-5" />
							<span className="text-gray-500">
								{t("loadingProducts")}
							</span>
						</div>
					</section>
				) : (
					<section className="col-span-1 md:col-span-3">
						{products?.length > 0 ? (
							<div className="grid min-[500px]:grid-cols-2 lg:grid-cols-3 gap-4">
								{products?.map((product: ProductPropType) => (
									<ProductCard
										key={product.id}
										product={product}
									/>
								))}
								<Paginator
									pages={productsData?.pages}
									isFetching={isFetching}
								/>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/20">
								<p className="text-muted-foreground text-sm">
									{t("noProductsMatchFilters")}
								</p>
								<Button
									variant="link"
									onClick={clearFilters}
									className="mt-2 text-xs"
								>
									{t("clearFilters")}
								</Button>
							</div>
						)}
					</section>
				)}
			</div>
		</main>
	);
}
