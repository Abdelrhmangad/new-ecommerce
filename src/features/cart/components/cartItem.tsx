"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import useStore from "@/store/cart-store";

export interface CartItem {
	variantSku: string;
	productId: string;
	name: { en: string; ar: string };
	price: number;
	size: string;
	colorName: string;
	colorHex: string;
	image: string;
	quantity: number;
	maxStock: number;
}

interface CartItemRowProps {
	item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
	const locale = useLocale();
	const isArabic = locale === "ar";
	const itemName = isArabic ? item.name.ar : item.name.en;
	const isMaxStockReached = item.quantity >= item.maxStock;
	// Store actions
	const updateCartItem = useStore((state) => state.updateCartItem);
	const removeFromCart = useStore((state) => state.removeFromCart);

	const handleDecrement = () => {
		// Calling updateCartItem with quantity 0 automatically triggers removal in your store
		updateCartItem(item.variantSku, item.quantity - 1);
	};

	const handleIncrement = () => {
		if (!isMaxStockReached) {
			updateCartItem(item.variantSku, item.quantity + 1);
		}
	};

	return (
		<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 px-4 w-full">
			{/* Product Image & Basic Info */}
			<div className="flex items-center gap-4 w-full md:w-auto">
				<div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
					<Image
						src={item.image}
						alt={itemName}
						fill
						sizes="80px"
						className="object-cover object-center"
					/>
				</div>

				<div className="flex flex-col space-y-1">
					{/* Title linking back to product page */}
					<Link
						href={`/products/${item.productId}`}
						className="font-medium text-foreground hover:underline line-clamp-1 text-sm sm:text-base"
					>
						{itemName}
					</Link>

					{/* Variant Attributes (Size & Color Swatch) */}
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						{/* Color Swatch */}
						<div className="flex items-center gap-1.5">
							<span
								className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm inline-block"
								style={{ backgroundColor: item.colorHex }}
								title={item.colorName}
							/>
							<span>{item.colorName}</span>
						</div>

						<span>•</span>

						{/* Size */}
						<span>
							Size:{" "}
							<strong className="font-semibold text-foreground">
								{item.size}
							</strong>
						</span>
					</div>

					{/* Single Item Unit Price */}
					<span className="text-sm font-semibold text-foreground">
						${item.price.toFixed(2)}
					</span>
				</div>
			</div>

			{/* Quantity & Actions */}
			<div className="flex items-center md:flex-col-reverse justify-between w-full md:w-auto sm:justify-end gap-6 pt-2 sm:pt-0">
				{/* Quantity Controls */}
				<div className="flex flex-col ms-auto gap-1">
					<div className="flex items-center border rounded-md bg-background shadow-sm">
						<button
							type="button"
							onClick={handleDecrement}
							disabled={item.quantity <= 1}
							className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							aria-label="Decrease quantity"
						>
							<Minus className="h-3.5 w-3.5" />
						</button>

						<span className="w-8 text-center text-sm font-medium select-none">
							{item.quantity}
						</span>

						<button
							type="button"
							onClick={handleIncrement}
							disabled={isMaxStockReached}
							className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							aria-label="Increase quantity"
						>
							<Plus className="h-3.5 w-3.5" />
						</button>
					</div>

					{/* Max stock warning notice */}
					{isMaxStockReached && (
						<span className="text-[10px] text-destructive font-medium">
							Max available reached
						</span>
					)}
				</div>
				{/* Total Price & Delete Action */}
				<div className="flex items-center gap-4">
					<span className="text-base font-bold text-foreground min-w-18 text-right">
						${(item.price * item.quantity).toFixed(2)}
					</span>

					<button
						type="button"
						onClick={() => removeFromCart(item.variantSku)}
						className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
						aria-label="Remove item"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
