"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { ProductPropType } from "../types/Product.types";

export default function ProductCard({ product }: { product: ProductPropType }) {
	const t = useTranslations("Products");
	const [isHovered, setIsHovered] = useState(false);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);

	const primaryImage = product.images[0] || "/images/placeholder.jpg";
	const secondaryImage = product.images[1] || primaryImage;

	return (
		<div className="group relative flex flex-col rounded-lg border bg-card transition-all hover:shadow-sm">
			{/* 1. Image Container with Aspect Ratio tailored for clothing (3:4) */}
			<Link
				href={`/products/${product.id}`}
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
					{product.compareAtPrice &&
						product.compareAtPrice > product.price && (
							<Badge
								variant="destructive"
								className="text-xs rounded-sm"
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
					<span>{product.category.en}</span>
					<div className="flex items-center gap-1">
						{product.colors.slice(0, 3).map((color) => (
							<span
								key={color.name}
								className="h-2.5 w-2.5 rounded-full border border-border"
								style={{ backgroundColor: color.hex }}
								title={color.name}
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
					href={`/products/${product.id}`}
					className="mt-1 font-medium text-sm line-clamp-1 hover:underline"
				>
					{product.name.en}
				</Link>

				{/* Pricing */}
				<div className="mt-2 flex items-baseline gap-2">
					<span className="font-semibold text-sm">
						{t("price", { price: product.price })}
					</span>
					{product.compareAtPrice &&
						product.compareAtPrice > product.price && (
							<span className="text-xs text-muted-foreground line-through">
								{t("price", { price: product.compareAtPrice })}
							</span>
						)}
				</div>

				{/* Quick Size Selector on Hover/Focus */}
				<div className="mt-3 pt-2 border-t flex items-center justify-between gap-1">
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

					<Button
						size="sm"
						variant="secondary"
						className="h-7 text-xs px-2 shrink-0"
						disabled={!selectedSize}
					>
						{t("addToCart")}
					</Button>
				</div>
			</div>
		</div>
	);
}
