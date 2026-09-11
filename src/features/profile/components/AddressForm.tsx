"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "../types/profile.types";

interface Props {
	address?: UserProfile["defaultAddress"];
	onSave: (data: NonNullable<UserProfile["defaultAddress"]>) => void;
}

export function AddressForm({ address, onSave }: Props) {
	const t = useTranslations("Profile");
	const [form, setForm] = useState({
		governorate: address?.governorate ?? "",
		city: address?.city ?? "",
		address: address?.address ?? "",
		building: address?.building ?? "",
		floor: address?.floor ?? ""
	});

	const update = <K extends keyof typeof form>(key: K, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSave(form);
			}}
			className="space-y-4"
		>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="gov">{t("governorate")}</Label>
					<Input
						id="gov"
						value={form.governorate}
						onChange={(e) => update("governorate", e.target.value)}
						placeholder={t("governorate_placeholder")}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="city">{t("city")}</Label>
					<Input
						id="city"
						value={form.city}
						onChange={(e) => update("city", e.target.value)}
						placeholder={t("city_placeholder")}
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="street">{t("street_address")}</Label>
				<Input
					id="street"
					value={form.address}
					onChange={(e) => update("address", e.target.value)}
					placeholder={t("street_placeholder")}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label htmlFor="building">{t("building")}</Label>
					<Input
						id="building"
						value={form.building}
						onChange={(e) => update("building", e.target.value)}
					/>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="floor">{t("floor")}</Label>
					<Input
						id="floor"
						value={form.floor}
						onChange={(e) => update("floor", e.target.value)}
					/>
				</div>
			</div>

			<Button type="submit" className="mt-2">
				{t("update_address")}
			</Button>
		</form>
	);
}
