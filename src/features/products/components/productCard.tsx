"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { ProductColorType, ProductPropType } from "../types/Product.types";
import AddToCartBtn from "../../cart/components/addToCartBtn";

export default function ProductCard({ product }: { product: ProductPropType }) {
	const locale = useLocale() as "en" | "ar";
	const t = useTranslations("Products");
	const [isHovered, setIsHovered] = useState(false);
	const [selectedColor, setSelectedColor] = useState<string>(
		product?.colors[0]?.name["en"]
	);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const productImages = product?.colors[0]?.images as {
		primary: string;
		secondary: string;
		gallery: string[];
	};
	const primaryImage = productImages?.primary || "/images/placeholder.jpg";
	const secondaryImage = productImages?.secondary || primaryImage;
	return (
		<div className="group relative flex flex-col rounded-lg border bg-card transition-all hover:shadow-sm">
			{/* 1. Image Container with Aspect Ratio tailored for clothing (3:4) */}
			<Link
				href={`/products/${product.slug}`}
				className="relative aspect-3/4 w-full overflow-hidden rounded-t-lg bg-muted"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Image
					src={isHovered ? secondaryImage : primaryImage}
					alt={product.name.en}
					fill
					className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
					sizes="(max-width: 768px) 50vw, 25vw"
				/>

				{/* Status Badges */}
				<div className="absolute top-2 inset-s-2 flex flex-col gap-1">
					{product.isNew && (
						<Badge className="bg-primary text-xs rounded-sm">
							{t("new")}
						</Badge>
					)}
					{product.isOnSale && (
						<Badge
							variant="destructive"
							className="text-xs font-bold px-1 py-1 bg-red-100 rounded-xs shadow-md animate-pulse"
						>
							{t("sale")}
						</Badge>
					)}
				</div>
			</Link>

			{/* 2. Content & Details Layer */}
			<div className="flex flex-1 flex-col p-3">
				{/* Category & Color Swatches Row */}
				<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
					<span>{product.category?.name[locale]}</span>
					<div className="flex items-center gap-1">
						{product.colors
							.slice(0, 3)
							.map((color: ProductColorType) => (
								<button
									key={color.name[locale]}
									className={`h-3 w-3 rounded-full border ${selectedColor === color.name["en"] ? "transform scale-105 border-black" : "border-border"}`}
									style={{ backgroundColor: color.hex }}
									onClick={() =>
										setSelectedColor(color.name["en"])
									}
									type="button"
									title={color.name[locale]}
								/>
							))}
						{product.colors.length > 3 && (
							<span className="text-[10px] text-muted-foreground">
								+{product.colors.length - 3}
							</span>
						)}
					</div>
				</div>

				{/* Product Name */}
				<Link
					href={`/products/${product.slug}`}
					className="mt-1 font-medium text-sm line-clamp-1 hover:underline"
				>
					{product.name.en}
				</Link>

				{/* Pricing */}
				<div className="mt-2 flex items-baseline gap-2">
					<span className="font-semibold text-sm">
						{t("price", { price: product.price })}
					</span>
					{product.discountPercentage > 0 &&
						product.compareAtPrice > product.price && (
							<span className="text-xs text-muted-foreground line-through">
								{t("price", { price: product.compareAtPrice })}
							</span>
						)}
				</div>

				{/* Quick Size Selector on Hover/Focus */}
				<div className="mt-3 pt-2 border-t flex items-center justify-between sm:gap-1 gap-2">
					<div className="flex gap-1 overflow-x-auto no-scrollbar">
						{product.sizes.map((size) => (
							<button
								key={size}
								onClick={() => setSelectedSize(size)}
								className={`h-6 w-6 rounded border text-[10px] font-medium transition-colors ${
									selectedSize === size
										? "border-primary bg-primary text-primary-foreground"
										: "hover:border-primary/50"
								}`}
							>
								{size}
							</button>
						))}
					</div>

					<AddToCartBtn
						selectedSize={selectedSize}
						selectedColor={selectedColor}
						quantity={1}
						productName={product?.name["en"]}
						className="text-xs max-h-fit sm:max-w-fit max-w-full py-1"
						productVariants={product?.variants}
						product={product}
					/>
				</div>
			</div>
		</div>
	);
}
