"use client";
import { useTranslations } from "next-intl";
import React from "react";
import ProductCard from "./productCard";
import { ProductPropType } from "../types/Product.types";
import { useProducts } from "../services/products.queries";
import { useParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function SimilarCategoryProductsSection({
	categorySlug
}: {
	categorySlug: string;
}) {
	const t = useTranslations("Products");
	const params = useParams<{ slug?: string | string[] }>();
	const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
	const { data, isLoading } = useProducts({
		categories: categorySlug || "",
		exclude: slug
	});
	return (
		<div className="mt-16">
			<h2 className="font-bold text-xl">{t("youMightAlsoLike")}</h2>
			{isLoading ? (
				<div className="w-full h-full flex items-center justify-center min-h-40 bg-gray-50 mt-5">
					<LoaderCircle className="animate-spin w-5 h-5" />
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 mt-4">
					{data?.products.map((product: ProductPropType) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</div>
	);
}
