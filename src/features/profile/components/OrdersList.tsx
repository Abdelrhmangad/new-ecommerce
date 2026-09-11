"use client";

import { useTranslations } from "next-intl";
import { OrderCard } from "./OrderCard";
import { Package } from "lucide-react";
import { Order } from "../types/profile.types";

interface Props {
	orders: Order[];
	locale: "en" | "ar";
	onReorder?: (orderId: string) => void;
	onCancel?: (orderId: string) => void;
}

export function OrdersList({ orders, locale, onReorder, onCancel }: Props) {
	const t = useTranslations("Profile");

	if (orders.length === 0) {
		return (
			<div className="flex flex-col items-center py-16 text-center">
				<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
					<Package className="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 className="text-base font-medium">{t("no_orders")}</h3>
				<p className="mt-1 text-sm text-muted-foreground">
					{t("no_orders_desc")}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{orders.map((order) => (
				<OrderCard
					key={order.id}
					order={order}
					locale={locale}
					onReorder={onReorder}
					onCancel={onCancel}
				/>
			))}
		</div>
	);
}
