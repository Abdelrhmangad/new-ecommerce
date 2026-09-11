"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "../types/profile.types";
import useAuthStore from "@/store/user-store";

interface Props {
	onSave: (data: Partial<UserProfile>) => void;
}

export function ProfileForm({ onSave }: Props) {
	const t = useTranslations("Profile");
	const { auth } = useAuthStore();
	const userData = auth.user;

	const [form, setForm] = useState({
		name: userData?.name || "",
		email: userData?.email || "",
		phone: userData?.phone || ""
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
		if (!form.name.trim()) next.name = t("required");
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
			<div className="space-y-1.5">
				<Label htmlFor="firstName">{t("name")}</Label>
				<Input
					id="firstName"
					value={form.name}
					onChange={(e) => update("name", e.target.value)}
				/>
				{errors.name && (
					<p className="text-xs text-destructive">{errors.name}</p>
				)}
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
