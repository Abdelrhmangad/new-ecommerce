import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React from "react";
import {
	ProductPropType,
	ProductVariantType
} from "../../products/types/Product.types";
import { addPdtToCart } from "../../../shared/utils/cart.utils";

export default function AddToCartBtn({
	className,
	productName,
	selectedColor,
	selectedSize,
	quantity,
	productVariants,
	product
}: {
	className?: string;
	productName?: string;
	selectedColor: string;
	selectedSize: string | null;
	quantity: number;
	productVariants: ProductVariantType[];
	product: ProductPropType;
}) {
	const t = useTranslations("Products");
	const tCart = useTranslations("Cart");
	const pdtVariant = productVariants?.find(
		(variant: ProductVariantType) =>
			variant.colorName === selectedColor && variant.size === selectedSize
	);
	const selectedColorObj = product.colors.find(
		(color) => color?.name?.en === selectedColor
	);
	const isOutOfStock = (pdtVariant?.quantity ?? 0) <= 0;
	const isVariantOutOfStock = Boolean(
		pdtVariant && quantity > pdtVariant.quantity
	);

	const showOutOfStockBtn = isOutOfStock || isVariantOutOfStock;

	return showOutOfStockBtn && selectedSize ? (
		<Button
			size="lg"
			variant="destructive"
			className={`flex-1 py-4.5 text-base ${className || ""}`}
			disabled={!selectedSize}
			type="button"
			aria-label={"Product is out of stock"}
		>
			{selectedSize ? t("outOfStock") : t("selectSize")}
		</Button>
	) : (
		<Button
			size="lg"
			className={`flex-1 py-4.5 text-base ${className || ""}`}
			disabled={!selectedSize}
			onClick={() =>
				addPdtToCart(
					{
						...product,
						selectedSku: pdtVariant?.sku || "",
						quantity: quantity,
						selectedColorHex: selectedColorObj?.hex || ""
					},
					tCart
				)
			}
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
