import SingleProductPage from "@/shared/components/singleProductPage";
import { ProductPropType } from "@/shared/types/Product.types";
import axios from "axios";
import { Metadata } from "next";

export async function generateMetadata({
	params
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`
	);
	const product: ProductPropType = res.data;
	return {
		title: `${product.name.en} | Your Store`,
		description: `Shop ${product.name.en}. Price: ${product.price} EGP. High-quality ${product.category?.name.en}.`,
		openGraph: {
			title: product.name.en,
			description: `Shop ${product.name.en}. Price: ${product.price} EGP.`,
			images: [
				{
					url: product.colors[0]?.images.primary ?? "",
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
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`
	);
	const product: ProductPropType = res.data;
	return <SingleProductPage product={product} id={product.id} />;
}
