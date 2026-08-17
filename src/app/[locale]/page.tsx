import LocaleSwitcher from "@/shared/components/localeSwitcher";
import Navbar from "@/shared/components/navbar";

export default function HomePage() {
	return (
		<main className="">
			<Navbar />
			<LocaleSwitcher />
		</main>
	);
}
