import Navbar from "@/shared/components/navbar";
import { BannerItem, ProductsBanner } from "@/shared/components/productsBanner";

export default function HomePage() {
	const BANNER_SLIDES: BannerItem[] = [
		{
			id: 1,
			title: "Explore the Wilderness",
			description:
				"Experience untouched nature and peaceful landscapes away from city noise.",
			imageUrl:
				"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
			buttonText: "Discover More",
			buttonLink: "#"
		},
		{
			id: 2,
			title: "Modern Architectural Wonders",
			description:
				"Discover clean designs and futuristic structures in the heart of the modern world.",
			imageUrl:
				"https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
			buttonText: "View Gallery",
			buttonLink: "#"
		},
		{
			id: 3,
			title: "Serene Ocean Horizons",
			description:
				"Relax with breath-taking views of clear waters and warm golden sunsets.",
			imageUrl:
				"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
			buttonText: "Book Vacation",
			buttonLink: "#"
		}
	];
	return (
		<main className="">
			<Navbar />
			<ProductsBanner items={BANNER_SLIDES} />
		</main>
	);
}
