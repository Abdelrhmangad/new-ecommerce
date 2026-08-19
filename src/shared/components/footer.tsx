"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
	const t = useTranslations("Footer");
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full border-t border-stone-200 bg-stone-50 text-zinc-700">
			<div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand Info */}
					<div className="md:col-span-2 space-y-3">
						<h3 className="text-base font-semibold tracking-wider text-zinc-900 uppercase">
							Clothing Co.
						</h3>
						<p className="max-w-sm text-sm text-zinc-500 leading-relaxed font-light">
							{t("about")}
						</p>
					</div>

					{/* Shop Links */}
					<div className="space-y-3">
						<h4 className="text-xs font-semibold tracking-wider text-zinc-900 uppercase">
							{t("shop")}
						</h4>
						<ul className="space-y-2 text-sm text-zinc-500 font-light">
							<li>
								<Link
									href="/products"
									className="hover:text-zinc-900 transition-colors"
								>
									{t("allProducts")}
								</Link>
							</li>
							<li>
								<Link
									href="/new-arrivals"
									className="hover:text-zinc-900 transition-colors"
								>
									{t("newArrivals")}
								</Link>
							</li>
							<li>
								<Link
									href="/sale"
									className="hover:text-zinc-900 transition-colors"
								>
									{t("sale")}
								</Link>
							</li>
						</ul>
					</div>

					{/* Support Links */}
					<div className="space-y-3">
						<h4 className="text-xs font-semibold tracking-wider text-zinc-900 uppercase">
							{t("help")}
						</h4>
						<ul className="space-y-2 text-sm text-zinc-500 font-light">
							<li>
								<Link
									href="/faq"
									className="hover:text-zinc-900 transition-colors"
								>
									{t("faq")}
								</Link>
							</li>
							<li>
								<Link
									href="/shipping"
									className="hover:text-zinc-900 transition-colors"
								>
									{t("shipping")}
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="hover:text-zinc-900 transition-colors"
								>
									{t("contact")}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-light">
					<p>
						© {currentYear} Clothing Co. {t("rights")}
					</p>

					<div className="flex gap-6">
						<Link
							href="/privacy"
							className="hover:text-zinc-600 transition-colors"
						>
							{t("privacy")}
						</Link>
						<Link
							href="/terms"
							className="hover:text-zinc-600 transition-colors"
						>
							{t("terms")}
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
