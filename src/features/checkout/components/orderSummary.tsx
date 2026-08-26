"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CartItem } from "@/features/cart/types/Cart.types";

interface Props {
	items: CartItem[];
	total: number;
	shipping?: number;
}

export function OrderSummary({ items, total, shipping = 0 }: Props) {
	const t = useTranslations("Checkout");
	const locale = useLocale() as "en" | "ar";

	return (
		<div className="rounded-xl border bg-background p-5 mt-5">
			<h3 className="mb-4 text-base font-medium">{t("order_summary")}</h3>

			<div className="max-h-64 space-y-3 overflow-y-auto pr-1">
				{items.map((item) => (
					<div key={item.variantSku} className="flex gap-3">
						<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
							<Image
								src={item.image}
								alt={item.name[locale]}
								fill
								className="object-cover"
								sizes="48px"
							/>
						</div>
						<div className="flex-1 min-w-0">
							<p className="truncate text-sm font-medium">
								{item.name[locale]}
							</p>
							<p className="text-xs text-muted-foreground">
								{item.colorName} · {item.size} · Qty{" "}
								{item.quantity}
							</p>
						</div>
						<span className="text-sm font-medium tabular-nums">
							{(item.price * item.quantity).toLocaleString()} EGP
						</span>
					</div>
				))}
			</div>

			<div className="mt-4 space-y-2 border-t pt-4 text-sm">
				<div className="flex justify-between">
					<span className="text-muted-foreground">
						{t("subtotal")}
					</span>
					<span className="tabular-nums">
						{total.toLocaleString()} EGP
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">
						{t("shipping")}
					</span>
					<span
						className={
							shipping === 0
								? "font-medium text-green-600"
								: "tabular-nums"
						}
					>
						{shipping === 0
							? t("free")
							: `${shipping.toLocaleString()} EGP`}
					</span>
				</div>
				<div className="flex justify-between border-t pt-3 text-base font-medium">
					<span>{t("total")}</span>
					<span className="tabular-nums">
						{(total + shipping).toLocaleString()} EGP
					</span>
				</div>
			</div>
		</div>
	);
}
