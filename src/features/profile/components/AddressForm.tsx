"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "../types/profile.types";
import useAuthStore from "@/store/user-store";
import { EgyptLocationSelector } from "@/features/checkout/components/governoratesSelectInput";
import { useUpdateUserData } from "@/features/user/queries/user.queries";

interface Props {
	onSave: (data: NonNullable<UserProfile["defaultAddress"]>) => void;
}

export function AddressForm({ onSave }: Props) {
	const t = useTranslations("Profile");
	const { auth } = useAuthStore();

	const { mutateAsync: updateUserProfile, isPending } = useUpdateUserData();

	const userData = auth.user;
	const userAddress = userData?.address;
	const initialForm = {
		governorate: userAddress?.governorate ?? "",
		city: userAddress?.city ?? "",
		address: userAddress?.street ?? "",
		building: userAddress?.building ?? "",
		floor: userAddress?.floor ?? ""
	};

	const [form, setForm] = useState(initialForm);

	const update = <K extends keyof typeof form>(key: K, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const errors: Partial<Record<keyof typeof form, string>> = {};
	const isDirty = Object.keys(initialForm).some(
		(key) =>
			form[key as keyof typeof form] !==
			initialForm[key as keyof typeof initialForm]
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isDirty) return;

		await updateUserProfile({
			address: {
				governorate: form.governorate,
				city: form.city,
				street: form.address,
				building: form.building,
				floor: form.floor
			}
		});

		onSave(form);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
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

			<Button
				type="submit"
				className="mt-2"
				disabled={isPending || !isDirty}
			>
				{t("update_address")}
			</Button>
		</form>
	);
}
