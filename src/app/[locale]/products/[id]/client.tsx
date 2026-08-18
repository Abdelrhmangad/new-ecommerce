"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";
import { DUMMY_PRODUCTS } from "@/shared/data/products.data";
import ProductCard from "@/shared/components/productCard";
import { ProductPropType } from "@/shared/types/Product.types";

interface SingleProductClientProps {
	product: ProductPropType;
	id: string;
}

export default function SingleProductClient({
	product,
	id
}: SingleProductClientProps) {
	const locale = useLocale() as "en" | "ar";
	const t = useTranslations("Products");

	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [selectedColor, setSelectedColor] = useState(
		product.colors[0]?.name || ""
	);
	const [quantity, setQuantity] = useState(1);

	return (
		<main className="container mx-auto max-w-6xl px-4 py-8">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
				{/* 1. Media Gallery (Sticky on desktop) */}
				<div className="flex flex-col-reverse gap-4 md:flex-row md:items-start">
					{/* Thumbnails */}
					<div className="flex flex-row gap-3 w-fit md:flex-col">
						{product.images.map((img, idx) => (
							<button
								key={idx}
								onClick={() => setSelectedImage(idx)}
								className={`relative aspect-3/4 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
									selectedImage === idx
										? "border-primary"
										: "border-transparent opacity-70"
								}`}
								aria-label={`View product image ${idx + 1} of ${product.images.length}`}
							>
								<Image
									src={img}
									alt={product.name[locale]}
									fill
									className="object-cover"
								/>
							</button>
						))}
					</div>

					{/* Main Image View */}
					<div className="relative h-full aspect-3/4 w-full overflow-hidden rounded-lg bg-muted">
						<Image
							src={
								product.images[selectedImage] ||
								product.images[0]
							}
							alt={product.name[locale]}
							fill
							priority
							className="object-cover"
						/>
					</div>
				</div>
				{/* 2. Purchase & Details Column */}
				<div className="flex flex-col">
					{/* Category & Title */}
					<span className="text-xs uppercase tracking-wider text-muted-foreground">
						{product.category[locale]}
					</span>
					<h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
						{product.name[locale]}
					</h1>

					{/* Pricing */}
					<div className="mt-3 flex items-baseline gap-3">
						<span className="text-2xl font-bold" itemProp="price">
							{t("price", { price: product.price })}
						</span>
						{product.compareAtPrice && (
							<span className="text-sm text-muted-foreground line-through">
								{t("price", { price: product.compareAtPrice })}
							</span>
						)}
					</div>

					<hr className="my-6" />

					{/* Color Selector */}
					<div className="space-y-2">
						<label
							htmlFor="color-selector"
							className="text-sm font-medium"
						>
							{t("color")}:{" "}
							<span className="text-muted-foreground">
								{selectedColor}
							</span>
						</label>
						<div
							id="color-selector"
							className="flex items-center gap-2 mt-1"
							role="group"
							aria-labelledby="color-label"
						>
							{product.colors.map((color) => (
								<button
									key={color.name}
									onClick={() => setSelectedColor(color.name)}
									className={`h-7 w-7 rounded-full border-2 transition-transform ${
										selectedColor === color.name
											? "scale-110 border-red-200"
											: "border-transparent"
									}`}
									style={{ backgroundColor: color.hex }}
									title={color.name}
									aria-label={`Select ${color.name} color`}
									aria-pressed={selectedColor === color.name}
								/>
							))}
						</div>
					</div>

					{/* Size Selector */}
					<div className="mt-6 space-y-2">
						<div className="flex items-center justify-between">
							<label
								htmlFor="size-selector"
								className="text-sm font-medium"
							>
								{t("size")}:{" "}
							</label>
						</div>
						<div
							id="size-selector"
							className="grid grid-cols-4 gap-2"
							role="group"
							aria-labelledby="size-label"
						>
							{product.sizes.map((size) => (
								<button
									key={size}
									onClick={() => setSelectedSize(size)}
									className={`h-10 rounded-md border text-sm font-medium transition-all ${
										selectedSize === size
											? "border-primary bg-primary text-primary-foreground"
											: "hover:border-primary/50"
									}`}
									aria-label={`Select size ${size}`}
									aria-pressed={selectedSize === size}
								>
									{size}
								</button>
							))}
						</div>
					</div>

					{/* Quantity & CTA Buttons */}
					<div className="mt-8 flex gap-3">
						<div className="flex items-center rounded-md border overflow-hidden">
							<button
								onClick={() =>
									setQuantity((q) => Math.max(1, q - 1))
								}
								className="px-3 py-2 text-sm hover:bg-muted bg-gray-50"
								aria-label="Decrease quantity"
							>
								-
							</button>
							<span
								className="px-3 text-sm font-medium"
								aria-live="polite"
								aria-label={`Current quantity: ${quantity}`}
							>
								{quantity}
							</span>
							<button
								onClick={() => setQuantity((q) => q + 1)}
								className="px-3 py-2 text-sm hover:bg-muted bg-gray-50"
								aria-label="Increase quantity"
							>
								+
							</button>
						</div>

						<Button
							size="lg"
							className="flex-1 h-full"
							disabled={!selectedSize}
							aria-label={
								selectedSize
									? `Add ${quantity} ${product.name[locale]} to cart`
									: "Please select a size first"
							}
						>
							{selectedSize ? t("addToCart") : t("selectSize")}
						</Button>
					</div>

					{/* Collapsible Details */}
					<Accordion
						defaultValue={["fabric"]}
						className="mt-8 w-full"
					>
						<AccordionItem value="fabric">
							<AccordionTrigger className="text-sm font-medium">
								Fabric & Care
							</AccordionTrigger>
							<AccordionContent className="text-sm text-muted-foreground">
								100% Heavyweight Organic Cotton. Machine wash
								cold with like colors.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="shipping">
							<AccordionTrigger className="text-sm font-medium">
								Shipping & Returns
							</AccordionTrigger>
							<AccordionContent className="text-sm text-muted-foreground">
								Free standard shipping on orders over 1000 EGP.
								Returns accepted within 14 days.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<div className="flex mt-4 gap-1">
						{product.compareAtPrice &&
							product.compareAtPrice > product.price && (
								<Badge
									variant="destructive"
									className="text-sm px-2 py-2 bg-red-100 rounded-xs shadow-md animate-pulse"
								>
									{t("sale")}
								</Badge>
							)}
						{product.isNew && (
							<Badge className="bg-primary text-sm px-2 py-2 rounded-xs">
								{t("new")}
							</Badge>
						)}
					</div>
				</div>
			</div>
			<section className="mt-16">
				<h2 className="font-bold text-xl">{t("youMightAlsoLike")}</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 mt-4">
					{DUMMY_PRODUCTS.map((product: ProductPropType) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</section>
		</main>
	);
}
