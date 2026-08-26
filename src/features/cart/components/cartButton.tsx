"use client";

import { CreditCard, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import useStore from "@/store/store";
import { CartItemRow } from "./cartItem";
import { useRouter } from "@/i18n/routing";

export function CartDrawer() {
	const t = useTranslations("Cart");
	const router = useRouter();

	const {
		showCart: isCartShown,
		items,
		total
	} = useStore((state) => state.cart);
	const toggleCart = useStore((state) => state.toggleCart);
	const clearCart = useStore((state) => state.clearCart);

	const isEmpty = items.length === 0;
	return (
		<Sheet
			open={isCartShown}
			onOpenChange={(open) => {
				if (open !== isCartShown) {
					toggleCart();
				}
			}}
		>
			{/* Cart Trigger Button */}
			<SheetTrigger
				render={
					<Button
						variant="outline"
						size="icon"
						className="p-4 leading-0 relative cursor-pointer"
					>
						<ShoppingCart className="inline-block h-4 w-4" />
						<span className="sr-only">Open cart</span>
						{/* Optional item counter badge */}
						<span className="absolute -inset-s-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
							{items?.length || 0}
						</span>
					</Button>
				}
			>
				{/* children are optional for render-based composition */}
			</SheetTrigger>

			{/* Slide-over Sidebar Drawer */}
			<SheetContent
				className="flex flex-col justify-between sm:max-w-md! max-w-full! w-full!"
				showCloseButton={false}
			>
				<div>
					<SheetHeader className="text-start">
						<SheetTitle className="text-base">
							{t("title")}
						</SheetTitle>
						<SheetDescription className="text-base">
							{t("description")}
						</SheetDescription>
					</SheetHeader>
					<X
						className="absolute w-5 h-5 top-4 right-3 cursor-pointer"
						onClick={() => toggleCart()}
					/>

					<div className="flex items-center justify-center my-6 text-muted-foreground text-sm">
						{items?.length === 0 ? (
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
							<div className="divide-y divide-border border-b w-full">
								{items.map((cartItem) => (
									<CartItemRow
										key={cartItem.variantSku}
										item={cartItem}
									/>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Footer Actions */}
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
						onClick={() => {
							toggleCart();
							router.push("/checkout");
						}}
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
