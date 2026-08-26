"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "@/i18n/routing";

interface Props {
	orderId: string;
}

export function OrderConfirmation({ orderId }: Props) {
	const t = useTranslations("Checkout");
	const router = useRouter();

	return (
		<div className="flex flex-col items-center py-12 text-center">
			<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
				<CheckCircle className="h-8 w-8" />
			</div>

			<h2 className="text-xl font-medium">{t("thank_you")}</h2>
			<p className="mt-2 max-w-xs text-sm text-muted-foreground">
				{t("confirmation_desc")}
			</p>

			<div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 font-mono text-sm">
				<Package className="h-4 w-4 text-muted-foreground" />
				{orderId}
			</div>

			<div className="mt-8 flex w-full max-w-xs flex-col gap-3">
				<Button
					className="h-11 w-full"
					onClick={() => router.replace("/")}
				>
					{t("continue_shopping")}
				</Button>
				<Button
					variant="outline"
					className="h-11 w-full"
					render={<Link href="/orders">{t("view_orders")}</Link>}
				></Button>
			</div>
		</div>
	);
}
