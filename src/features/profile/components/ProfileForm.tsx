"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "../types/profile.types";

interface Props {
	profile: UserProfile;
	onSave: (data: Partial<UserProfile>) => void;
}

export function ProfileForm({ profile, onSave }: Props) {
	const t = useTranslations("Profile");
	const [form, setForm] = useState({
		firstName: profile.firstName,
		lastName: profile.lastName,
		email: profile.email,
		phone: profile.phone
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof typeof form, string>>
	>({});

	const update = <K extends keyof typeof form>(key: K, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const validate = () => {
		const next: typeof errors = {};
		if (!form.firstName.trim()) next.firstName = t("required");
		if (!form.lastName.trim()) next.lastName = t("required");
		if (!form.email.trim()) next.email = t("required");
		else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email))
			next.email = t("invalid_email");
		if (!form.phone.trim()) next.phone = t("required");
		else if (!/^01[0125]\\d{8}$/.test(form.phone.trim()))
			next.phone = t("invalid_phone");

		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validate()) onSave(form);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="firstName">{t("first_name")}</Label>
					<Input
						id="firstName"
						value={form.firstName}
						onChange={(e) => update("firstName", e.target.value)}
					/>
					{errors.firstName && (
						<p className="text-xs text-destructive">
							{errors.firstName}
						</p>
					)}
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="lastName">{t("last_name")}</Label>
					<Input
						id="lastName"
						value={form.lastName}
						onChange={(e) => update("lastName", e.target.value)}
					/>
					{errors.lastName && (
						<p className="text-xs text-destructive">
							{errors.lastName}
						</p>
					)}
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="email">{t("email")}</Label>
				<Input
					id="email"
					type="email"
					value={form.email}
					onChange={(e) => update("email", e.target.value)}
				/>
				{errors.email && (
					<p className="text-xs text-destructive">{errors.email}</p>
				)}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="phone">{t("phone")}</Label>
				<Input
					id="phone"
					type="tel"
					value={form.phone}
					onChange={(e) => update("phone", e.target.value)}
					dir="ltr"
				/>
				{errors.phone && (
					<p className="text-xs text-destructive">{errors.phone}</p>
				)}
			</div>

			<Button type="submit" className="mt-2">
				{t("save_changes")}
			</Button>
		</form>
	);
}
