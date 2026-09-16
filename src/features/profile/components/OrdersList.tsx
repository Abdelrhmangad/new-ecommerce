"use client";

import { useLocale, useTranslations } from "next-intl";
import { OrderCard } from "./OrderCard";
import { Package } from "lucide-react";
import { Order } from "../types/profile.types";
import { useUserOrders } from "@/features/orders/queries/orders.queries";
import { useState } from "react";
import Paginator, { SimplePaginator } from "@/shared/components/paginator";

interface Props {
	onReorder?: (orderId: string) => void;
}

export function OrdersList({ onReorder }: Props) {
	const locale = useLocale() as "en" | "ar";
	const t = useTranslations("Profile");
	const [page, setPage] = useState(1);
	const { data, isLoading } = useUserOrders({ page: page });
	const orders = data?.orders;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center py-16 text-center">
				<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
					<Package className="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 className="text-base font-medium">{t("loading_orders")}</h3>
			</div>
		);
	}

	if (orders?.length === 0) {
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
			{orders?.map((order) => (
				<OrderCard
					key={order._id}
					order={order}
					locale={locale}
					onReorder={onReorder}
				/>
			))}
			<SimplePaginator
				totalPages={data?.meta?.totalPages || 1}
				currentPage={page}
				onPageChange={setPage}
			/>
		</div>
	);
}
