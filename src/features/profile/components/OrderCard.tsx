"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Package, RotateCcw, Eye, MapPin } from "lucide-react";
import { OrderStatus } from "../types/profile.types";
import { OrderObjectType } from "@/features/orders/types/orders.types";

const statusConfig: Record<
	OrderStatus,
	{ labelKey: string; className: string }
> = {
	pending: {
		labelKey: "status_pending",
		className: "bg-amber-50 text-amber-700 border-amber-200"
	},
	processing: {
		labelKey: "status_processing",
		className: "bg-blue-50 text-blue-700 border-blue-200"
	},
	shipped: {
		labelKey: "status_shipped",
		className: "bg-sky-50 text-sky-700 border-sky-200"
	},
	delivered: {
		labelKey: "status_delivered",
		className: "bg-green-50 text-green-700 border-green-200"
	},
	cancelled: {
		labelKey: "status_cancelled",
		className: "bg-red-50 text-red-700 border-red-200"
	}
};

interface Props {
	order: OrderObjectType;
	locale: "en" | "ar";
	onReorder?: (orderId: string) => void;
	onCancel?: (orderId: string) => void;
}

export function OrderCard({ order, locale, onReorder, onCancel }: Props) {
	const t = useTranslations("Profile");
	const statusKey = order.status as OrderStatus;
	const status = statusConfig[statusKey];
	const date = new Date(order.createdAt).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});

	return (
		<div className="rounded-xl border bg-background p-4 transition-colors hover:border-muted-foreground/30 sm:p-5">
			{/* Header */}
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="font-mono text-sm text-muted-foreground">
						{order._id}
					</p>
					<p className="mt-0.5 text-xs text-muted-foreground">
						{date}
					</p>
				</div>
				<span
					className={`rounded-md border px-2.5 py-1 text-xs font-medium ${status.className}`}
				>
					{t(status.labelKey)}
				</span>
			</div>

			{/* Items */}
			<div className="mt-4 flex gap-2.5">
				{order.items.map((item) => (
					<div
						key={item?.nameSnapshot?.[locale]}
						className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted sm:h-14 sm:w-14"
					>
						{item?.images?.length > 0 && (
							<Image
								src={item.images[0]}
								alt={`item.nameSnapshot?.[locale]`}
								className="object-cover"
								fill
								sizes="56px"
							/>
						)}
					</div>
				))}
			</div>

			{/* Footer */}
			<div className="mt-4 flex items-center justify-between border-t pt-3">
				<span className="text-sm text-muted-foreground">
					{t("items_count", { count: order.items.length })}
				</span>
				<span className="text-base font-medium tabular-nums">
					{order?.totalAmount.toLocaleString()} EGP
				</span>
			</div>

			{/* Actions */}
			<div className="mt-3 flex flex-wrap gap-2">
				<Button
					variant="ghost"
					size="sm"
					className="h-8 gap-1.5 text-xs"
				>
					<Eye className="h-3.5 w-3.5" />
					{t("view_details")}
				</Button>

				{order.status === "shipped" && (
					<Button
						variant="ghost"
						size="sm"
						className="h-8 gap-1.5 text-xs"
					>
						<MapPin className="h-3.5 w-3.5" />
						{t("track")}
					</Button>
				)}

				{order.status === "delivered" && onReorder && (
					<Button
						variant="ghost"
						size="sm"
						className="h-8 gap-1.5 text-xs"
						onClick={() => onReorder(order._id)}
					>
						<RotateCcw className="h-3.5 w-3.5" />
						{t("reorder")}
					</Button>
				)}
			</div>
		</div>
	);
}
