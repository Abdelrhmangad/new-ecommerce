/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ProductPropType } from "../../features/products/types/Product.types";
import ProductCard from "../../features/products/components/productCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useProductsCategories } from "../services/categories.queries";
import { IconRenderer } from "./iconRenderer";
import { SingleCategoryType } from "../types/Categories.types";

export interface CategoryItem {
	id: string;
	label: string;
	icon: React.ElementType;
	href?: string;
}

export default function CategoriesPills() {
	const locale = useLocale();
	const t = useTranslations("Categories");
	const { data: categoriesData, isPending } = useProductsCategories();
	const [activeCategory, setActiveCategory] = useState<string>(
		categoriesData && categoriesData?.[0]?.slug
	);
	useEffect(() => {
		if (!isPending && categoriesData) {
			setActiveCategory(categoriesData?.[0]?.slug);
		}
	}, [categoriesData, isPending]);
	const activeCategoryProducts = categoriesData?.find(
		(cate: SingleCategoryType) => cate.slug === activeCategory
	);
	return (
		<div className="container md:px-0 px-3 mx-auto ">
			<nav
				aria-label="Quick Category Filter"
				className="w-full mt-5 overflow-x-auto no-scrollbar py-1"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 sm:gap-3 min-w-max">
						{categoriesData?.map((cat: SingleCategoryType) => {
							const isActive = activeCategory === cat.slug;

							return (
								<button
									key={cat._id}
									onClick={() => setActiveCategory(cat.slug)}
									className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-0 focus:ring-slate-400 dark:focus:ring-slate-600 ${
										isActive
											? "bg-slate-900 text-white border-slate-900 shadow-sm dark:bg-white dark:text-slate-900 dark:border-white"
											: "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
									}`}
								>
									<IconRenderer name={cat.icon} />
									<span>
										{cat.name[locale as "ar" | "en"]}
									</span>
								</button>
							);
						})}
					</div>
					<Link
						className="lg:block hidden"
						href={`/products?category=${activeCategory}`}
						passHref
					>
						<Button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-0 focus:ring-slate-400 dark:focus:ring-slate-600 h-full underline">
							{t("viewAll")}
							<ArrowRight
								className={`h-4 w-4 text-white dark:text-slate-400 transform rotate-0 rtl:rotate-180 transition-transform duration-200`}
							/>
						</Button>
					</Link>
				</div>
			</nav>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 mt-4">
				{isPending ? (
					<div className="bg-gray-50 flex items-center justify-center min-h-80 col-span-full">
						<LoaderCircle className="animate-spin w-7 h-7" />
					</div>
				) : (
					activeCategoryProducts?.products?.map(
						(product: ProductPropType) => (
							<ProductCard key={product.id} product={product} />
						)
					)
				)}
			</div>

			<Link
				className="lg:hidden mx-auto mt-5 flex align-center justify-center w-max"
				href={`/products?category=${activeCategory}`}
				passHref
			>
				<Button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-0 focus:ring-slate-400 dark:focus:ring-slate-600 h-full underline">
					{t("viewAll")}
					<ArrowRight
						className={`h-4 w-4 text-white dark:text-slate-400 transform rotate-0 rtl:rotate-180 transition-transform duration-200`}
					/>
				</Button>
			</Link>
		</div>
	);
}
