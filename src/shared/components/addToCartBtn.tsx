import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React from "react";
import { ProductVariantType } from "../types/Product.types";

export default function AddToCartBtn({
	className,
	productName,
	selectedColor,
	selectedSize,
	quantity,
	productVariants
}: {
	className?: string;
	productName?: string;
	selectedColor: string;
	selectedSize: string | null;
	quantity: number;
	productVariants: ProductVariantType[];
}) {
	const t = useTranslations("Products");
	const pdtVariant = productVariants?.find(
		(variant: ProductVariantType) =>
			variant.colorName === selectedColor && variant.size === selectedSize
	);
	const isOutOfStock = (pdtVariant?.quantity ?? 0) <= 0;
	console.log("PDT details", {
		name: productName,
		outOfStock: isOutOfStock,
		variant: pdtVariant
	});

	const showOutOfStockBtn =
		(selectedSize && isOutOfStock) ||
		quantity > (pdtVariant?.quantity ?? 0);

	function addToCart() {
		console.log("isOutOfStock", isOutOfStock);
	}
	return showOutOfStockBtn ? (
		<Button
			size="lg"
			variant="destructive"
			className={`flex-1 py-4.5 text-base ${className || ""}`}
			disabled={!selectedSize}
			onClick={() => addToCart()}
			aria-label={"Product is out of stock"}
		>
			{selectedSize ? t("outOfStock") : t("selectSize")}
		</Button>
	) : (
		<Button
			size="lg"
			className={`flex-1 py-4.5 text-base ${className || ""}`}
			disabled={!selectedSize}
			onClick={() => addToCart()}
			aria-label={
				selectedSize
					? `Add ${quantity} ${productName || "product"} to cart`
					: "Please select a size first"
			}
		>
			{selectedSize ? t("addToCart") : t("selectSize")}
		</Button>
	);
}
