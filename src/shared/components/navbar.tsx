"use client";
import { useState } from "react";
import { Menu, X, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { CartDrawer } from "./cartButton";
import LocaleSwitcher from "./localeSwitcher";
import { Link } from "@/i18n/routing";

export default function Navbar() {
	const [open, setOpen] = useState(false);

	const t = useTranslations("Navbar");

	const NAV_LINKS = [
		{ label: t("home"), href: "/" },
		{ label: t("products"), href: "/products" },
		{ label: t("features"), href: "#features" },
		{ label: t("cart"), href: "#cart" }
	];
	return (
		<header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/80">
			<div className="flex h-16 container mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<a
					href="#"
					className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-slate-100"
				>
					<span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
						<Rocket className="h-4 w-4" />
					</span>
					<span className="text-base">Acme</span>
				</a>

				{/* Desktop nav */}
				<nav className="hidden md:flex md:items-center md:gap-1">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Desktop actions */}
				<div className="hidden md:flex md:items-center md:gap-3">
					<button className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
						{t("log_in")}
					</button>
					<CartDrawer />
					<LocaleSwitcher />
				</div>

				{/* Mobile menu button */}
				<button
					onClick={() => setOpen(!open)}
					aria-label="Toggle menu"
					aria-expanded={open}
					className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden dark:text-slate-200 dark:hover:bg-slate-800"
				>
					{open ? (
						<X className="h-5 w-5" />
					) : (
						<Menu className="h-5 w-5" />
					)}
				</button>
			</div>

			{/* Mobile menu panel */}
			<div
				className={`overflow-hidden border-t border-slate-200 transition-all duration-300 ease-in-out md:hidden dark:border-slate-800 ${
					open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<nav className="flex flex-col gap-1 px-4 py-3">
					{NAV_LINKS.map((link) => (
						<a
							key={link.label}
							href={link.href}
							onClick={() => setOpen(false)}
							className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
						>
							{link.label}
						</a>
					))}
					<div className="mt-2 flex gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
						<button className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
							{t("log_in")}
						</button>
						<div className="flex items-center gap-2 ms-auto">
							<CartDrawer />
							<LocaleSwitcher />
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}
