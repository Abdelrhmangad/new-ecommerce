"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CreditCard, Banknote, ArrowLeft } from "lucide-react";

type Method = "cod" | "card";

interface Props {
	onBack: () => void;
	onPlaceOrder: (method: Method) => void;
	isSubmitting?: boolean;
}

export function PaymentForm({ onBack, onPlaceOrder, isSubmitting }: Props) {
	const t = useTranslations("Checkout");
	const [method, setMethod] = useState<Method>("cod");

	return (
		<div className="space-y-6">
			<div className="space-y-3">
				{/* COD */}
				<label
					className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
						method === "cod"
							? "border-primary bg-muted/50"
							: "border-border hover:border-muted-foreground/30"
					}`}
				>
					<input
						type="radio"
						name="payment"
						className="sr-only"
						checked={method === "cod"}
						onChange={() => setMethod("cod")}
					/>
					<div
						className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
							method === "cod"
								? "border-primary"
								: "border-muted-foreground/30"
						}`}
					>
						{method === "cod" && (
							<div className="h-2.5 w-2.5 rounded-full bg-primary" />
						)}
					</div>
					<Banknote className="h-5 w-5 text-muted-foreground" />
					<div>
						<p className="text-sm font-medium">{t("cod")}</p>
						<p className="text-xs text-muted-foreground">
							{t("cod_desc")}
						</p>
					</div>
				</label>

				{/* Card */}
				<label
					className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${
						method === "card"
							? "border-primary bg-muted/50"
							: "border-border hover:border-muted-foreground/30"
					}`}
				>
					<input
						type="radio"
						name="payment"
						className="sr-only"
						checked={method === "card"}
						onChange={() => setMethod("card")}
					/>
					<div
						className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
							method === "card"
								? "border-primary"
								: "border-muted-foreground/30"
						}`}
					>
						{method === "card" && (
							<div className="h-2.5 w-2.5 rounded-full bg-primary" />
						)}
					</div>
					<CreditCard className="h-5 w-5 text-muted-foreground" />
					<div>
						<p className="text-sm font-medium">{t("card")}</p>
						<p className="text-xs text-muted-foreground">
							{t("card_desc")}
						</p>
					</div>
				</label>
			</div>

			{/* Card form placeholder — expand when you integrate a gateway */}
			{method === "card" && (
				<div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
					{t("card_integration_placeholder")}
				</div>
			)}

			<div className="flex gap-3 pt-2">
				<Button
					variant="outline"
					className="h-11 flex-1"
					onClick={onBack}
					disabled={isSubmitting}
				>
					<ArrowLeft className="mr-1.5 h-4 w-4" />
					{t("back")}
				</Button>
				<Button
					className="h-11 flex-[2] text-base"
					onClick={() => onPlaceOrder(method)}
					disabled={isSubmitting}
				>
					{isSubmitting ? t("placing_order") : t("place_order")}
				</Button>
			</div>
		</div>
	);
}
