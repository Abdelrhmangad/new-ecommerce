/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { CheckoutProgress } from "@/features/checkout/components/checkoutProgress";
import { OrderConfirmation } from "@/features/checkout/components/orderConfirmation";
import { OrderSummary } from "@/features/checkout/components/orderSummary";
import { PaymentForm } from "@/features/checkout/components/paymentForm";
import { ShippingForm } from "@/features/checkout/components/shippingForm";
import useStore from "@/store/cart-store";
import { LoaderCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

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
	if (!loading && items.length === 0) redirect(`/${locale}/products`);
	const [orderId, setOrderId] = useState("");
	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<CheckoutProgress current={step} />
			{step === 1 && <ShippingForm onSubmit={() => setStep(2)} />}
			{step === 2 && (
				<PaymentForm
					onBack={() => setStep(1)}
					onPlaceOrder={() => setStep(3)}
				/>
			)}
			{step === 3 && <OrderConfirmation orderId={orderId} />}

			{/* Sticky order summary on desktop */}
			{step !== 3 && <OrderSummary items={items} total={total} />}
		</div>
	);
}
