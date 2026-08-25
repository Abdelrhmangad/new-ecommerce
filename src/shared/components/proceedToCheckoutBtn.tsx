"use client";

import { ShoppingCart, X, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetTrigger,
	SheetFooter,
	SheetClose
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import useStore from "@/store/store";
import { useMemo, useState } from "react";
import { CartItemRow } from "./cartItem";

export function CheckoutDrawer() {
	const t = useTranslations("Cart");
	const [showCheckout, toggleCheckout] = useState(false);
	const { items, total } = useStore((state) => state.cart);

	const clearCart = useStore((state) => state.clearCart);

	const itemCount = useMemo(
		() => items.reduce((sum, item) => sum + item.quantity, 0),
		[items]
	);

	const isEmpty = items.length === 0;

	return (
		<Sheet
			open={showCheckout}
			onOpenChange={(open) =>
				open !== showCheckout && toggleCheckout((prev) => !prev)
			}
		>
			{/* Trigger */}
			<SheetTrigger
				render={
					<Button
						variant="outline"
						size="icon"
						className="relative h-10 w-10 cursor-pointer"
						aria-label={t("open_cart")}
					>
						<ShoppingCart className="h-4 w-4" />
						{itemCount > 0 && (
							<span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-medium text-primary-foreground tabular-nums">
								{itemCount}
							</span>
						)}
					</Button>
				}
			></SheetTrigger>

			{/* Drawer */}
			<SheetContent
				className="flex w-full max-w-full flex-col gap-0 p-0 sm:max-w-md"
				aria-describedby="cart-description"
			>
				{/* Header */}
				<SheetHeader className="space-y-1 px-6 pt-6 pb-4 text-left">
					<div className="flex items-start justify-between">
						<div>
							<SheetTitle className="text-lg font-medium">
								{t("title")}
							</SheetTitle>
							<SheetDescription
								id="cart-description"
								className="text-sm text-muted-foreground"
							>
								{isEmpty
									? t("empty_description")
									: t("item_count", { count: itemCount })}
							</SheetDescription>
						</div>
						<SheetClose
							render={
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 shrink-0 rounded-lg"
									aria-label={t("close")}
								>
									<X className="h-4 w-4" />
								</Button>
							}
						></SheetClose>
					</div>
				</SheetHeader>

				{/* Scrollable Items */}
				<div className="flex-1 overflow-y-auto px-6">
					{isEmpty ? (
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
								<ShoppingCart className="h-6 w-6 text-muted-foreground" />
							</div>
							<p className="text-base font-medium">
								{t("empty_cart")}
							</p>
							<p className="mt-1 text-sm text-muted-foreground">
								{t("empty_subtitle")}
							</p>
						</div>
					) : (
						<div className="divide-y divide-border">
							{items.map((cartItem) => (
								<CartItemRow
									key={cartItem.variantSku}
									item={cartItem}
								/>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				<SheetFooter className="flex-col gap-0 border-t bg-background px-6 py-5 sm:flex-col">
					{!isEmpty && (
						<div className="mb-4 flex items-center justify-between">
							<span className="text-sm text-muted-foreground">
								{t("subtotal")}
							</span>
							<span className="text-xl font-medium tabular-nums">
								{total.toLocaleString()} EGP
							</span>
						</div>
					)}

					<Button
						className="h-12 w-full gap-2 text-base font-medium"
						disabled={isEmpty}
					>
						<CreditCard className="h-4 w-4" />
						{isEmpty ? t("cart_empty_action") : t("checkout")}
					</Button>

					{!isEmpty && (
						<Button
							variant="ghost"
							size="sm"
							className="mt-2 h-auto py-2 text-xs text-muted-foreground hover:text-destructive"
							onClick={clearCart}
						>
							<Trash2 className="mr-1.5 h-3.5 w-3.5" />
							{t("clear_cart")}
						</Button>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
