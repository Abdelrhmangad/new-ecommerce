"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";

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
			className="p-2 leading-0 text-sm border rounded-md hover:bg-accent"
			title={locale === "en" ? "العربية" : "English"}
		>
			<Globe className="inline-block w-4 h-4" />
		</button>
	);
}
