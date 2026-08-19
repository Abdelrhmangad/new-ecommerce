import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProductsClient from "./client";
import { DUMMY_PRODUCTS } from "@/shared/data/products.data";

const CATEGORY_LABELS = new Map(
	DUMMY_PRODUCTS.map((product) => [product.category.en, product.category])
);
const VALID_SIZES = new Set(DUMMY_PRODUCTS.flatMap((product) => product.sizes));
const VALID_SORTS = new Set(["low-high", "high-low"]);

export async function generateMetadata({
	params,
	searchParams
}: {
	params: Promise<{ locale: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
	const [{ locale }, query] = await Promise.all([params, searchParams]);
	const t = await getTranslations({ locale, namespace: "Products" });
	const categories = getQueryValues(query.categories).filter((category) =>
		CATEGORY_LABELS.has(category)
	);
	const sizes = getQueryValues(query.sizes).filter((size) =>
		VALID_SIZES.has(size)
	);
	const sort =
		typeof query.sort === "string" && VALID_SORTS.has(query.sort)
			? query.sort
			: undefined;
	const categoryText = categories
		.map(
			(category) =>
				CATEGORY_LABELS.get(category)?.[locale === "ar" ? "ar" : "en"]
		)
		.join(locale === "ar" ? "، " : ", ");
	const filterText = [
		categoryText && `${t("categories")}: ${categoryText}`,
		sizes.length > 0 && `${t("size")}: ${sizes.join(", ")}`,
		sort &&
			`${t("sortBy")}: ${sort === "low-high" ? t("priceFromLowToHigh") : t("priceHighToLow")}`
	]
		.filter(Boolean)
		.join(locale === "ar" ? "؛ " : "; ");
	const title = filterText ? `${filterText} | ${t("title")}` : t("title");
	const description = filterText
		? `${t("title")}: ${filterText}.`
		: `${t("title")}. Browse our latest clothing collection and filter by category, size, and price.`;

	return {
		title,
		description,
		openGraph: {
			title,
			description
		}
	};
}

function getQueryValues(value: string | string[] | undefined) {
	return (Array.isArray(value) ? value : (value?.split(",") ?? []))
		.flatMap((item) => item.split(","))
		.map((item) => item.trim())
		.filter(Boolean);
}

export default function ProductsPage() {
	return <ProductsClient />;
}
