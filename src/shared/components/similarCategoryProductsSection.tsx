import { useTranslations } from "next-intl";
import React from "react";
import ProductCard from "./productCard";
import { ProductPropType } from "../types/Product.types";
import { DUMMY_PRODUCTS } from "../data/products.data";
import { useProducts } from "../services/products.queries";

export default function SimilarCategoryProductsSection({
	categorySlug
}: {
	categorySlug: string;
}) {
	const t = useTranslations("Products");
	console.log("categorySlug", categorySlug);
	const { data, isLoading } = useProducts({ categories: categorySlug || "" });
	console.log("data", data);
	return (
		<div className="mt-16">
			<h2 className="font-bold text-xl">{t("youMightAlsoLike")}</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 mt-4">
				{data?.products.map((product: ProductPropType) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
