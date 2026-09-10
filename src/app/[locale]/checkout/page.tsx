/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { CheckoutProgress } from "@/features/checkout/components/checkoutProgress";
import { OrderConfirmation } from "@/features/checkout/components/orderConfirmation";
import { OrderSummary } from "@/features/checkout/components/orderSummary";
import { CreateOrderForm } from "@/features/checkout/components/createOrderForm";
import useStore from "@/store/cart-store";
import { LoaderCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const generateReadableId = () => {
	const timestamp = Date.now().toString(36).toUpperCase();
	const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `ORD-${timestamp}-${randomStr}`;
};
// app/[locale]/checkout/page.tsx
export default function CheckoutPage() {
	const locale = useLocale();
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const { items, total } = useStore((s) => s.cart);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	}, []);
	if (loading) <LoaderCircle className="animate-spin " />;
	// Guard: empty cart
	// if (!loading && items.length === 0) redirect(`/${locale}/products`);
	const [orderId] = useState(() => generateReadableId());
	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<CheckoutProgress current={step} />
			{step === 1 && <CreateOrderForm nextStep={() => setStep(2)} />}
			{step === 1 && <OrderSummary items={items} total={total} />}

			{step === 2 && <OrderConfirmation orderId={orderId} />}
		</div>
	);
}
