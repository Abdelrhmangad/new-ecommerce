import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Roboto, Cairo } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/shared/components/navbar";
import Footer from "@/shared/components/footer";

const roboto = Roboto({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto"
});

const cairo = Cairo({
	subsets: ["arabic", "latin"],
	display: "swap",
	variable: "--font-cairo"
});

export default async function LocaleLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	const messages = await getMessages();
	const dir = locale === "ar" ? "rtl" : "ltr";
	const activeFontClass =
		locale === "ar" ? cairo.className : roboto.className;

	return (
		<html lang={locale} dir={dir}>
			<body
				className={`${activeFontClass} ${roboto.variable} ${cairo.variable} min-h-screen bg-background antialiased`}
			>
				<NextIntlClientProvider messages={messages}>
					<Navbar />
					{children}
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
