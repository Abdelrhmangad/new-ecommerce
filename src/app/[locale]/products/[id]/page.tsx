import SingleProductPage from "@/shared/components/singleProductPage";
import { DUMMY_PRODUCTS } from "@/shared/data/products.data";
import { Metadata } from "next";

export async function generateMetadata({
	params
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const product =
		DUMMY_PRODUCTS.find((p) => p.id === id) || DUMMY_PRODUCTS[0];

	return {
		title: `${product.name.en} | Your Store`,
		description: `Shop ${product.name.en}. Price: ${product.price} EGP. High-quality ${product.category.en}.`,
		openGraph: {
			title: product.name.en,
			description: `Shop ${product.name.en}. Price: ${product.price} EGP.`,
			images: [
				{
					url: product.images[0],
					width: 800,
					height: 1067,
					alt: product.name.en
				}
			]
		}
	};
}

export default async function Page({
	params
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <SingleProductPage id={id} />;
}
