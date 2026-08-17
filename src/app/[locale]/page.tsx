import LocaleSwitcher from "@/shared/components/localeSwitcher";
import { useTranslations } from "next-intl";

export default function HomePage() {
	const t = useTranslations("Hero");

	return (
		<main className="container mx-auto py-12 px-4">
			<h1 className="text-3xl font-bold tracking-tight">
				{t("heading")}
			</h1>
			<p className="text-muted-foreground mt-2">{t("subheading")}</p>
			<LocaleSwitcher />
		</main>
	);
}
