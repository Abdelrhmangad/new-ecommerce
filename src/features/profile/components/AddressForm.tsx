"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "../types/profile.types";
import useAuthStore from "@/store/user-store";
import { EgyptLocationSelector } from "@/features/checkout/components/governoratesSelectInput";

interface Props {
	onSave: (data: NonNullable<UserProfile["defaultAddress"]>) => void;
}

export function AddressForm({ onSave }: Props) {
	const t = useTranslations("Profile");
	const { auth } = useAuthStore();
	const userData = auth.user;
	const latestAddress = userData?.addresses?.[userData.addresses.length - 1];
	const [form, setForm] = useState({
		governorate: latestAddress?.governorate ?? "",
		city: latestAddress?.city ?? "",
		address: latestAddress?.street ?? "",
		building: latestAddress?.building ?? "",
		floor: latestAddress?.floor ?? ""
	});

	const update = <K extends keyof typeof form>(key: K, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const errors: Partial<Record<keyof typeof form, string>> = {};
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSave(form);
			}}
			className="space-y-4"
		>
			<EgyptLocationSelector
				governorateValue={form.governorate}
				cityValue={form.city}
				onGovernorateChange={(val) => update("governorate", val)}
				onCityChange={(val) => update("city", val)}
				governorateError={errors?.governorate}
				cityError={errors?.city}
				governorateLabel={t("governorate")}
				cityLabel={t("city")}
				governoratePlaceholder={t("governorate_placeholder")}
				cityPlaceholder={t("city_placeholder")}
			/>

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
