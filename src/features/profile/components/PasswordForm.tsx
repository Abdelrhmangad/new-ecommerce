"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
	onChangePassword: (data: {
		current: string;
		newPass: string;
		confirm: string;
	}) => void;
}

export function PasswordForm({ onChangePassword }: Props) {
	const t = useTranslations("Profile");
	const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
	const [errors, setErrors] = useState<
		Partial<Record<keyof typeof form, string>>
	>({});

	const update = <K extends keyof typeof form>(key: K, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const validate = () => {
		const next: typeof errors = {};
		if (!form.current) next.current = t("required");
		if (!form.newPass) next.newPass = t("required");
		else if (form.newPass.length < 8)
			next.newPass = t("password_too_short");
		if (form.newPass !== form.confirm)
			next.confirm = t("passwords_mismatch");

		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validate()) onChangePassword(form);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-1.5">
				<Label htmlFor="current">{t("current_password")}</Label>
				<Input
					id="current"
					type="password"
					value={form.current}
					onChange={(e) => update("current", e.target.value)}
				/>
				{errors.current && (
					<p className="text-xs text-destructive">{errors.current}</p>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="newPass">{t("new_password")}</Label>
					<Input
						id="newPass"
						type="password"
						value={form.newPass}
						onChange={(e) => update("newPass", e.target.value)}
					/>
					{errors.newPass && (
						<p className="text-xs text-destructive">
							{errors.newPass}
						</p>
					)}
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="confirm">{t("confirm_password")}</Label>
					<Input
						id="confirm"
						type="password"
						value={form.confirm}
						onChange={(e) => update("confirm", e.target.value)}
					/>
					{errors.confirm && (
						<p className="text-xs text-destructive">
							{errors.confirm}
						</p>
					)}
				</div>
			</div>

			<Button type="submit" className="mt-2">
				{t("change_password")}
			</Button>
		</form>
	);
}
