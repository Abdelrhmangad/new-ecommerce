"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LocaleSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const toggleLocale = () => {
		const nextLocale = locale === "en" ? "ar" : "en";
		router.replace(pathname, { locale: nextLocale });
	};

	return (
		<button
			onClick={toggleLocale}
			className="px-3 py-1 text-sm border rounded-md hover:bg-accent"
		>
			{locale === "en" ? "العربية" : "English"}
		</button>
	);
}
