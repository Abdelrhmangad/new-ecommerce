"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
	const t = useTranslations("Contact");

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: ""
	});
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Later: Connect to Express backend endpoint (e.g., POST /api/v1/contact)
		setSubmitted(true);
	};

	return (
		<main className="container mx-auto max-w-5xl px-4 py-12 min-h-[70dvh]">
			<div className="text-center mb-12">
				<h1 className="text-3xl font-bold tracking-tight">
					{t("contactUs")}
				</h1>
				<p className="text-sm text-muted-foreground mt-2">
					{t("askForHelp")}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
				{/* 1. Contact Information & Hours */}
				<div className="space-y-6">
					<h2 className="text-xl font-semibold">{t("getInTouch")}</h2>
					<p className="text-sm text-muted-foreground leading-relaxed">
						{t("getInTouchDescription")}
					</p>

					<div className="space-y-4 pt-4">
						<div className="flex items-center gap-3 text-sm">
							<Mail className="h-5 w-5 text-muted-foreground shrink-0" />
							<span>support@ministore.com</span>
						</div>
						<div className="flex items-center gap-3 text-sm">
							<Phone className="h-5 w-5 text-muted-foreground shrink-0" />
							<span dir="ltr">+20 100 000 0000</span>
						</div>
						<div className="flex items-center gap-3 text-sm">
							<MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
							<span>{t("location")}</span>
						</div>
						<div className="flex items-center gap-3 text-sm">
							<Clock className="h-5 w-5 text-muted-foreground shrink-0" />
							<span>{t("hours")}</span>
						</div>
					</div>
				</div>

				{/* 2. Contact Form */}
				<div className="rounded-xl border bg-card p-8 shadow-sm">
					{submitted ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<h3 className="text-lg font-semibold">
								{t("sentTitle")}
							</h3>
							<p className="text-sm text-muted-foreground mt-2">
								{t("sentDescription")}
							</p>
							<Button
								variant="outline"
								size="lg"
								className="mt-6"
								onClick={() => {
									setSubmitted(false);
									setFormData({
										name: "",
										email: "",
										message: ""
									});
								}}
							>
								{t("sendAnother")}
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label className="text-sm font-medium mb-1.5 block">
									{t("fullName")}
								</label>
								<Input
									required
									className="h-11 text-base md:text-sm"
									placeholder={t("namePlaceholder")}
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value
										})
									}
								/>
							</div>

							<div>
								<label className="text-sm font-medium mb-1.5 block">
									{t("emailAddress")}
								</label>
								<Input
									required
									type="email"
									className="h-11 text-base md:text-sm"
									placeholder={t("emailPlaceholder")}
									value={formData.email}
									onChange={(e) =>
										setFormData({
											...formData,
											email: e.target.value
										})
									}
								/>
							</div>

							<div>
								<label className="text-sm font-medium mb-1.5 block">
									{t("message")}
								</label>
								<textarea
									required
									rows={5}
									className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
									placeholder={t("messagePlaceholder")}
									value={formData.message}
									onChange={(e) =>
										setFormData({
											...formData,
											message: e.target.value
										})
									}
								/>
							</div>

							<Button
								type="submit"
								size="lg"
								className="w-full text-base font-medium"
							>
								{t("sendMessage")}
							</Button>
						</form>
					)}
				</div>
			</div>
		</main>
	);
}
