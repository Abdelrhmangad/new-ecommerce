"use client";
import useStore from "@/store/store";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { useState } from "react";

// app/[locale]/checkout/page.tsx
export default function CheckoutPage() {
	const locale = useLocale();
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const { items, total } = useStore((s) => s.cart);

	// Guard: empty cart
	if (items.length === 0) redirect(`/${locale}/shop`);

	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<CheckoutProgress current={step} />
			{step === 1 && <ShippingForm onNext={() => setStep(2)} />}
			{step === 2 && (
				<PaymentForm
					onBack={() => setStep(1)}
					onNext={() => setStep(3)}
				/>
			)}
			{step === 3 && <OrderConfirmation />}

			{/* Sticky order summary on desktop */}
			<OrderSummary items={items} total={total} />
		</div>
	);
}
