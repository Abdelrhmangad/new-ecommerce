"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
	const locale = useLocale();
	const t = useTranslations("Newsletter");

	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success">(
		"idle"
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setStatus("loading");
		// Simulate API request
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setStatus("success");
		setEmail("");
	};

	return (
		<section className="w-full bg-gray-100 py-16 text-zinc-800 md:py-20 mt-10">
			<div className="container mx-auto px-4 md:px-6">
				<div className="mx-auto max-w-xl text-center">
					<h2 className="text-2xl font-light tracking-wide uppercase text-zinc-900 sm:text-3xl">
						{t("title")}
					</h2>

					<p className="mt-3 text-sm text-zinc-500 font-normal leading-relaxed sm:text-base">
						{t("description")}
					</p>

					{status === "success" ? (
						<div className="mt-6 flex items-center justify-center gap-2 rounded-md bg-stone-100 p-4 border border-stone-200 text-emerald-700">
							<CheckCircle2 className="h-5 w-5 shrink-0" />
							<p className="text-sm font-medium">
								{t("successMessage")}
							</p>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className="mt-8 flex flex-col sm:flex-row gap-3"
						>
							<Input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder={t("placeholder")}
								className="h-11 border-zinc-200 bg-white text-zinc-800 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-slate-400 rounded-md"
							/>

							<Button
								type="submit"
								disabled={status === "loading"}
								className="h-11 px-7 bg-[#94A8A0] hover:bg-[#83978F] text-white font-medium uppercase tracking-wider text-xs rounded-md transition-colors shrink-0"
							>
								{status === "loading" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									t("button")
								)}
							</Button>
						</form>
					)}

					<p className="mt-4 text-[11px] text-zinc-400">
						{t("disclaimer")}
					</p>
				</div>
			</div>
		</section>
	);
}
