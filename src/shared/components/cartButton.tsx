"use client";

import { ShoppingCart, X } from "lucide-react";
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

export function CartDrawer() {
	const t = useTranslations("Cart");
	const {
		showCart: isCartShown,
		items,
		total
	} = useStore((state) => state.cart);
	const toggleCart = useStore((state) => state.toggleCart);
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
						className="absolute w-5 h-5 top-4 right-3"
						onClick={() => toggleCart()}
					/>

					<div className="flex items-center justify-center my-6 text-muted-foreground text-sm">
						{items?.length === 0 ? (
							<p className="min-h-64 border-b border-t w-full text-center grid place-items-center">
								{t("empty_cart")}
							</p>
						) : (
							<div className="flex flex-col border-t">
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
				<p className="w-full px-4 text-base text-end">
					<span>Total: </span>
					<span className="font-semibold">{total} EGP</span>
				</p>
				{/* Footer Actions */}
				<SheetFooter className="flex-col gap-2 sm:flex-col">
					<Button className="w-full py-5 text-base">
						{t("checkout")}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
