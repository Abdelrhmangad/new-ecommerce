import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// import { routing } from "@/i18n/routing";
import "@/app/globals.css";

export default async function LocaleLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// if (!routing.locales.includes(locale as "ar" | "en")) {
	// 	notFound();
	// }

	const messages = await getMessages();
	const dir = locale === "ar" ? "rtl" : "ltr";

	return (
		<html lang={locale} dir={dir}>
			<body className="min-h-screen bg-background antialiased">
				<NextIntlClientProvider messages={messages}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
