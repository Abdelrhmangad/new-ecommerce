"use client";
import React, { useState } from "react";
import { Sparkles, Shirt, Flame, Tag, Percent, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductPropType } from "../types/Product.types";
import ProductCard from "./productCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { DUMMY_PRODUCTS } from "../data/products.data";

export interface CategoryItem {
	id: string;
	label: string;
	icon: React.ElementType;
	href?: string;
}

export default function CategoriesPills() {
	const t = useTranslations("Categories");
	const [activeCategory, setActiveCategory] = useState<string>("new");
	const handleCategoryClick = (id: string) => {
		setActiveCategory(id);
	};

	const CATEGORIES: CategoryItem[] = [
		{ id: "new", label: t("new"), icon: Sparkles },
		{ id: "sale", label: t("sale"), icon: Percent },
		{ id: "fashion", label: t("fashion"), icon: Shirt },
		{ id: "bestsellers", label: t("bestsellers"), icon: Flame },
		{ id: "popular", label: t("popular"), icon: Tag }
	];

	return (
		<div className="container md:px-0 px-3 mx-auto ">
			<nav
				aria-label="Quick Category Filter"
				className="w-full mt-5 overflow-x-auto no-scrollbar py-1"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 sm:gap-3 min-w-max">
						{CATEGORIES.map((cat) => {
							const Icon = cat.icon;
							const isActive = activeCategory === cat.id;

							return (
								<button
									key={cat.id}
									onClick={() => handleCategoryClick(cat.id)}
									className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-0 focus:ring-slate-400 dark:focus:ring-slate-600 ${
										isActive
											? "bg-slate-900 text-white border-slate-900 shadow-sm dark:bg-white dark:text-slate-900 dark:border-white"
											: "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
									}`}
								>
									<Icon
										className={`h-4 w-4 ${
											isActive
												? "text-white dark:text-slate-900"
												: "text-slate-500 dark:text-slate-400"
										}`}
									/>
									<span>{cat.label}</span>
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
				{DUMMY_PRODUCTS.map((product: ProductPropType) => (
					<ProductCard key={product.id} product={product} />
				))}
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
