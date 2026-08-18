import CategoriesPills from "@/shared/components/categoriesPills";
import Navbar from "@/shared/components/navbar";
import Newsletter from "@/shared/components/newsLetter";
import { BannerItem, ProductsBanner } from "@/shared/components/productsBanner";
import { useTranslations } from "next-intl";

export default function HomePage() {
	const t = useTranslations("ProductsBanner");
	const BANNER_SLIDES: BannerItem[] = [
		{
			id: 1,
			title: t("wilderness.title"),
			description: t("wilderness.description"),
			imageUrl:
				"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
			buttonText: t("wilderness.button"),
			buttonLink: "#"
		},
		{
			id: 2,
			title: t("architectural.title"),
			description: t("architectural.description"),
			imageUrl:
				"https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
			buttonText: t("architectural.button"),
			buttonLink: "#"
		},
		{
			id: 3,
			title: t("ocean.title"),
			description: t("ocean.description"),
			imageUrl:
				"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
			buttonText: t("ocean.button"),
			buttonLink: "#"
		}
	];
	return (
		<main className="">
			<Navbar />
			<ProductsBanner items={BANNER_SLIDES} />
			<CategoriesPills />
			<Newsletter />
		</main>
	);
}
