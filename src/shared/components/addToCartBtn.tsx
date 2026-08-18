import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React from "react";

export default function AddToCartBtn({
	selectedSize,
	quantity,
	productName,
	className
}: {
	selectedSize: string | null;
	quantity: number;
	productName?: string;
	className?: string;
}) {
	const t = useTranslations("Products");
	return (
		<Button
			size="lg"
			className={`flex-1 py-4.5 text-base ${className || ""}`}
			disabled={!selectedSize}
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
