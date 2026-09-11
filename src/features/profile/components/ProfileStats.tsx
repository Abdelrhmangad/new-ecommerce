"use client";

import { useTranslations } from "next-intl";
import { Package, Truck, Wallet } from "lucide-react";

interface Props {
	ordersCount: number;
	deliveredCount: number;
	totalSpent: number;
}

export function ProfileStats({
	ordersCount,
	deliveredCount,
	totalSpent
}: Props) {
	const t = useTranslations("Profile");

	const stats = [
		{ icon: Package, label: t("stat_orders"), value: ordersCount },
		{ icon: Truck, label: t("stat_delivered"), value: deliveredCount },
		{
			icon: Wallet,
			label: t("stat_spent"),
			value: `${totalSpent.toLocaleString()} EGP`
		}
	];

	return (
		<div className="grid grid-cols-3 gap-3 sm:gap-4">
			{stats.map(({ icon: Icon, label, value }) => (
				<div
					key={label}
					className="flex flex-col items-center rounded-xl border bg-background p-4 text-center"
				>
					<Icon className="mb-2 h-5 w-5 text-muted-foreground" />
					<span className="text-lg font-medium tabular-nums sm:text-xl">
						{value}
					</span>
					<span className="mt-0.5 text-xs text-muted-foreground">
						{label}
					</span>
				</div>
			))}
		</div>
	);
}
