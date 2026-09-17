"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EgyptLocationSelector } from "./governoratesSelectInput";
import useAuthStore from "@/store/user-store";
import { CreditCard, Banknote } from "lucide-react";
import {
	CreateOrderPayload,
	useCreateOrderMutation
} from "@/features/orders/queries/orders.queries";
import useCartStore from "@/store/cart-store";
import { Checkbox } from "@/components/ui/checkbox";

export function isValidEgyptianPhoneNumber(phone: string): boolean {
	return /^01[0125]\d{8}$/.test(phone.trim());
}

interface Props {
	defaultValues?: Partial<CheckoutFormData>;
	nextStep: () => void;
}

type CheckoutFormData = Omit<
	CreateOrderPayload,
	"shippingAddress" | "paymentMethodId" | "saveAddress"
> & {
	fullName: string;
	phone: string;
	governorate: string;
	city: string;
	address: string;
	building: string;
	floor: string;
	notes: string;
};

export function CreateOrderForm({ defaultValues, nextStep }: Props) {
	const t = useTranslations("Checkout");
	const { auth } = useAuthStore();
	const { cart, clearCart } = useCartStore();
	const cartItems = cart.items;

	const userData = auth.user;
	const [method, setMethod] = useState<"cod" | "card">("cod");

	const [data, setData] = useState<CheckoutFormData>({
		items: [],
		fullName: "",
		phone: "",
		governorate: "",
		city: "",
		address: "",
		building: "",
		floor: "",
		notes: "",
		...defaultValues
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof CheckoutFormData, string>>
	>({});

	useEffect(() => {
		if (userData) {
			const lastUserAddress = userData.address;

			// eslint-disable-next-line react-hooks/set-state-in-effect
			setData((prev) => ({
				...prev,
				...lastUserAddress,
				address: lastUserAddress?.street || prev.address,
				phone: userData.phone || prev.phone,
				fullName: userData.name || prev.fullName
			}));
		}
	}, [userData]);

	const validate = (): boolean => {
		const nextErrors: typeof errors = {};
		if (!data.fullName.trim()) nextErrors.fullName = t("required");
		if (!data.phone.trim()) nextErrors.phone = t("required");
		else if (!isValidEgyptianPhoneNumber(data.phone))
			nextErrors.phone = t("invalid_phone");
		if (!data.governorate.trim()) nextErrors.governorate = t("required");
		if (!data.city.trim()) nextErrors.city = t("required");
		if (!data.address.trim()) nextErrors.address = t("required");

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};
	const [saveAddress, setSaveAddress] = useState(true);

	const { mutateAsync, isPending } = useCreateOrderMutation();
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		await mutateAsync({
			items: cartItems,
			shippingAddress: {
				fullName: data.fullName,
				phone: data.phone,
				city: data.city,
				governorate: data.governorate,
				street: data.address,
				building: data.building,
				floor: data.floor,
				notes: data.notes
			},
			saveAddress: saveAddress,
			paymentMethodId: method
		});
		nextStep();
		clearCart();
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const update = <K extends keyof CheckoutFormData>(
		key: K,
		value: CheckoutFormData[K]
	) => {
		setData((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
	};
	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex items-center md:flex-row flex-col gap-5 mb-10">
					<div className="space-y-1.5 w-full">
						<Label htmlFor="fullName">{t("full_name")}</Label>
						<Input
							id="fullName"
							value={data.fullName}
							onChange={(e) => update("fullName", e.target.value)}
							placeholder={t("full_name_placeholder")}
						/>
						{errors.fullName && (
							<p className="text-xs text-destructive">
								{errors.fullName}
							</p>
						)}
					</div>

					<div className="space-y-1.5 w-full">
						<Label htmlFor="phone">{t("phone")}</Label>
						<Input
							id="phone"
							type="tel"
							value={data.phone}
							onChange={(e) => update("phone", e.target.value)}
							placeholder="01XXXXXXXXX"
							dir="ltr"
						/>
						{errors.phone && (
							<p className="text-xs text-destructive">
								{errors.phone}
							</p>
						)}
					</div>
				</div>

				<EgyptLocationSelector
					governorateValue={data.governorate}
					cityValue={data.city}
					onGovernorateChange={(val) => update("governorate", val)}
					onCityChange={(val) => update("city", val)}
					governorateError={errors.governorate}
					cityError={errors.city}
					governorateLabel={t("governorate")}
					cityLabel={t("city")}
					governoratePlaceholder={t("governorate_placeholder")}
					cityPlaceholder={t("city_placeholder")}
				/>

				<div className="space-y-1.5">
					<Label htmlFor="address">{t("address")}</Label>
					<Input
						id="address"
						value={data.address}
						onChange={(e) => update("address", e.target.value)}
						placeholder={t("address_placeholder")}
					/>
					{errors.address && (
						<p className="text-xs text-destructive">
							{errors.address}
						</p>
					)}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label htmlFor="building">{t("building")}</Label>
						<Input
							id="building"
							value={data.building}
							onChange={(e) => update("building", e.target.value)}
							placeholder="12"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="floor">{t("floor")}</Label>
						<Input
							id="floor"
							value={data.floor}
							onChange={(e) => update("floor", e.target.value)}
							placeholder="3"
						/>
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="notes">{t("notes")}</Label>
					<Input
						id="notes"
						value={data.notes}
						onChange={(e) => update("notes", e.target.value)}
						placeholder={t("notes_placeholder")}
					/>
				</div>

				<div className="space-y-1.5 flex items-center gap-2 mb-10">
					<Checkbox
						id="saveAddress"
						className="mb-0 pb-0"
						checked={saveAddress}
						onCheckedChange={(checked) => setSaveAddress(checked)}
					/>
					<Label htmlFor="saveAddress">{t("saveAddress")}</Label>
				</div>
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
								<p className="text-sm font-medium">
									{t("cod")}
								</p>
								<p className="text-xs text-muted-foreground">
									{t("cod_desc")}
								</p>
							</div>
						</label>

						{/* Card */}
						<label
							aria-disabled="true"
							className="flex cursor-not-allowed items-center gap-4 rounded-xl border border-border p-4 opacity-50 pointer-events-none select-none bg-muted/20"
						>
							<input
								type="radio"
								name="payment"
								className="sr-only"
								checked={method === "card"}
								disabled
							/>
							<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30">
								{method === "card" && (
									<div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
								)}
							</div>
							<CreditCard className="h-5 w-5 text-muted-foreground/60" />
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									{t("card")}
								</p>
								<p className="text-xs text-muted-foreground/70">
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
							className="h-11 flex-2 text-base"
							type="submit"
							disabled={isPending}
						>
							{isPending ? t("placing_order") : t("place_order")}
						</Button>
					</div>
				</div>
			</form>
		</>
	);
}
