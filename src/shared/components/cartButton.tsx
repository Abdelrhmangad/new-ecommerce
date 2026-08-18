"use client";

import { ShoppingCart } from "lucide-react";
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

export function CartDrawer() {
	const t = useTranslations("Cart");
	return (
		<Sheet>
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
							0
						</span>
					</Button>
				}
			>
				{/* children are optional for render-based composition */}
			</SheetTrigger>

			{/* Slide-over Sidebar Drawer */}
			<SheetContent
				className="flex w-full flex-col justify-between sm:max-w-md"
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

					{/* Cart Body Placeholder */}
					<div className="flex min-h-64 items-center justify-center border-b border-t my-6 text-muted-foreground text-sm">
						{t("empty_cart")}
					</div>
				</div>

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
