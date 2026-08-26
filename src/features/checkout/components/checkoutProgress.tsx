"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
	current: 1 | 2 | 3;
}

export function CheckoutProgress({ current }: Props) {
	const t = useTranslations("Checkout");
	const steps = [
		{ id: 1, label: t("shipping") },
		{ id: 2, label: t("payment") },
		{ id: 3, label: t("confirm") }
	];
	return (
		<div className="mb-8 flex items-center justify-center gap-2">
			{steps.map((step, idx) => {
				const isDone = current > step.id;
				const isActive = current === step.id;

				return (
					<div key={step.id} className="flex items-center gap-2">
						<div className="flex items-center gap-2">
							<span
								className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
									isDone
										? "border-primary bg-primary text-primary-foreground"
										: isActive
											? "border-primary text-primary"
											: "border-border text-muted-foreground"
								}`}
							>
								{isDone ? (
									<Check className="h-3.5 w-3.5" />
								) : (
									step.id
								)}
							</span>
							<span
								className={`hidden text-sm sm:inline ${
									isActive
										? "font-medium text-foreground"
										: "text-muted-foreground"
								}`}
							>
								{step.label}
							</span>
						</div>
						{idx < steps.length - 1 && (
							<div
								className={`mx-1 h-px w-8 sm:w-12 ${
									isDone ? "bg-primary" : "bg-border"
								}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
