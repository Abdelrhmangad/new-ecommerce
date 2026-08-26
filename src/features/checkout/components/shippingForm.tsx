"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ShippingData {
	fullName: string;
	phone: string;
	governorate: string;
	city: string;
	address: string;
	building?: string;
	floor?: string;
	notes?: string;
}

interface Props {
	defaultValues?: Partial<ShippingData>;
	onSubmit: (data: ShippingData) => void;
}

export function ShippingForm({ defaultValues, onSubmit }: Props) {
	const t = useTranslations("Checkout");
	const [data, setData] = useState<ShippingData>({
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
		Partial<Record<keyof ShippingData, string>>
	>({});

	const validate = (): boolean => {
		const nextErrors: typeof errors = {};
		if (!data.fullName.trim()) nextErrors.fullName = t("required");
		if (!data.phone.trim()) nextErrors.phone = t("required");
		else if (!/^01[0125]\d{8}$/.test(data.phone.trim()))
			nextErrors.phone = t("invalid_phone");
		if (!data.governorate.trim()) nextErrors.governorate = t("required");
		if (!data.city.trim()) nextErrors.city = t("required");
		if (!data.address.trim()) nextErrors.address = t("required");

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validate()) onSubmit(data);
	};

	const update = <K extends keyof ShippingData>(
		key: K,
		value: ShippingData[K]
	) => {
		setData((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-1.5">
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

			<div className="space-y-1.5">
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
					<p className="text-xs text-destructive">{errors.phone}</p>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="governorate">{t("governorate")}</Label>
					<Input
						id="governorate"
						value={data.governorate}
						onChange={(e) => update("governorate", e.target.value)}
						placeholder={t("governorate_placeholder")}
					/>
					{errors.governorate && (
						<p className="text-xs text-destructive">
							{errors.governorate}
						</p>
					)}
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="city">{t("city")}</Label>
					<Input
						id="city"
						value={data.city}
						onChange={(e) => update("city", e.target.value)}
						placeholder={t("city_placeholder")}
					/>
					{errors.city && (
						<p className="text-xs text-destructive">
							{errors.city}
						</p>
					)}
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="address">{t("address")}</Label>
				<Input
					id="address"
					value={data.address}
					onChange={(e) => update("address", e.target.value)}
					placeholder={t("address_placeholder")}
				/>
				{errors.address && (
					<p className="text-xs text-destructive">{errors.address}</p>
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

			<Button type="submit" className="mt-2 h-11 w-full text-base">
				{t("continue_to_payment")}
			</Button>
		</form>
	);
}
