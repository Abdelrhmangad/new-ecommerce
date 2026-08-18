"use client";
import React, { useState } from "react";
import { Sparkles, Shirt, Flame, Tag, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductPropType } from "../types/Product.types";
import ProductCard from "./productCard";
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
	const DUMMY_PRODUCTS: ProductPropType[] = [
		{
			id: "prod-1",
			name: {
				en: "Heavyweight Oversized Tee",
				ar: "تيشيرت أوفرسيز ثقيل"
			},
			price: 450,
			compareAtPrice: 550,
			category: {
				en: "T-Shirts",
				ar: "تيشيرتات"
			},
			images: [
				"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
				"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"
			],
			colors: [
				{ name: "Black", hex: "#18181b" },
				{ name: "White", hex: "#f4f4f5" },
				{ name: "Olive", hex: "#3f4e38" }
			],
			sizes: ["S", "M", "L", "XL"],
			isNew: true
		},
		{
			id: "prod-2",
			name: {
				en: "Relaxed Fit Denim Jacket",
				ar: "جاكيت جينز مريح"
			},
			price: 1200,
			category: {
				en: "Outerwear",
				ar: "ملابس خارجية"
			},
			images: [
				"https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
				"https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&auto=format&fit=crop&q=80"
			],
			colors: [
				{ name: "Washed Blue", hex: "#4a6b82" },
				{ name: "Raw Black", hex: "#222222" }
			],
			sizes: ["M", "L", "XL"],
			isNew: false
		},
		{
			id: "prod-3",
			name: {
				en: "Minimalist Fleece Hoodie",
				ar: "هودي ميلتون بسيط"
			},
			price: 850,
			compareAtPrice: 980,
			category: {
				en: "Hoodies",
				ar: "هوديز"
			},
			images: [
				"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
				"https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"
			],
			colors: [
				{ name: "Beige", hex: "#d7c4b7" },
				{ name: "Grey", hex: "#9ca3af" },
				{ name: "Black", hex: "#18181b" }
			],
			sizes: ["S", "M", "L", "XL", "XXL"],
			isNew: true
		},
		{
			id: "prod-4",
			name: {
				en: "Pleated Wide-Leg Trousers",
				ar: "بنطال واسع بكسرات"
			},
			price: 950,
			category: {
				en: "Pants",
				ar: "بنطلونات"
			},
			images: [
				"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
				"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80"
			],
			colors: [
				{ name: "Charcoal", hex: "#374151" },
				{ name: "Brown", hex: "#5c4033" }
			],
			sizes: ["S", "M", "L"],
			isNew: false
		}
	];
	return (
		<nav
			aria-label="Quick Category Filter"
			className="w-full container md:px-0 px-3 mx-auto mt-5 overflow-x-auto no-scrollbar py-1"
		>
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
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
				{DUMMY_PRODUCTS.map((product: ProductPropType) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</nav>
	);
}
