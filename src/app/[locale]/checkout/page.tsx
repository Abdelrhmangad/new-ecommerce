/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { CheckoutProgress } from "@/features/checkout/components/checkoutProgress";
import { OrderConfirmation } from "@/features/checkout/components/orderConfirmation";
import { OrderSummary } from "@/features/checkout/components/orderSummary";
import { CreateOrderForm } from "@/features/checkout/components/createOrderForm";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import useCartStore from "@/store/cart-store";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const generateReadableId = () => {
	const timestamp = Date.now().toString(36).toUpperCase();
	const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `ORD-${timestamp}-${randomStr}`;
};
// app/[locale]/checkout/page.tsx
export default function CheckoutPage() {
	const t = useTranslations("Cart");
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const { items, total } = useCartStore((state) => state.cart);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	}, []);
	// Guard: empty cart
	// if (!loading && items.length === 0) redirect(`/${locale}/products`);
	const [orderId] = useState(() => generateReadableId());
	if (loading) <LoaderCircle className="animate-spin " />;
	if (!loading && items.length === 0 && step !== 2) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<h2 className="text-2xl font-semibold mb-4">
					{t("empty_cart")}
				</h2>
				<p className="text-gray-600 mb-6">{t("empty_subtitle")}</p>
				<Button
					className="h-11 w-full max-w-xs"
					size="lg"
					render={<Link href="/products">{t("go_to_products")}</Link>}
				></Button>
			</div>
		);
	}
	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<CheckoutProgress current={step} />
			{step === 1 && <CreateOrderForm nextStep={() => setStep(2)} />}
			{step === 1 && <OrderSummary items={items} total={total} />}

			{step === 2 && <OrderConfirmation orderId={orderId} />}
		</div>
	);
}
