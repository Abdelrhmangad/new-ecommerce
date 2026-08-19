"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";

export default function AuthModal() {
	const t = useTranslations("Auth");

	const [isOpen, setIsOpen] = useState(false);
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [showPassword, setShowPassword] = useState(false);

	// Form State
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: ""
	});

	const handleOAuthLogin = (provider: "google" | "facebook") => {
		// Later: Redirect to Express backend endpoint (e.g., /api/v1/auth/google)
		console.log(`Initiating ${provider} login...`);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Later: Connect to Express backend authentication route
		console.log(`Submitting ${mode}:`, formData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{/* Trigger Button to place in your Navbar */}
			<DialogTrigger>
				<Button variant="default" size="lg">
					{t("signIn")}
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-105 p-6">
				<DialogHeader className="text-center">
					<DialogTitle className="text-xl font-bold tracking-tight text-center">
						{mode === "login"
							? t("welcomeBack")
							: t("createAccountTitle")}
					</DialogTitle>
				</DialogHeader>

				{/* OAuth Social Login Buttons */}
				<div className="grid grid-cols-2 gap-3 pt-2">
					<Button
						type="button"
						variant="outline"
						className="h-11 w-full gap-2 text-xs font-medium"
						onClick={() => handleOAuthLogin("google")}
					>
						{/* Google SVG Icon */}
						<svg className="h-4 w-4" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
							/>
						</svg>
						Google
					</Button>

					<Button
						type="button"
						variant="outline"
						className="h-11 w-full gap-2 text-xs font-medium"
						onClick={() => handleOAuthLogin("facebook")}
					>
						{/* Facebook SVG Icon */}
						<svg
							className="h-4 w-4 fill-[#1877F2]"
							viewBox="0 0 24 24"
						>
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
						Facebook
					</Button>
				</div>

				{/* Divider */}
				<div className="relative my-4 flex items-center justify-center">
					<hr className="w-full border-muted" />
					<span className="absolute bg-background px-2 text-[11px] uppercase tracking-wider text-muted-foreground">
						{t("orWithEmail")}
					</span>
				</div>

				{/* Credentials Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Email field (Sign Up mode only) */}
					{mode === "signup" && (
						<div>
							<label className="text-xs font-medium mb-1 block">
								{t("emailAddress")}
							</label>
							<div className="relative">
								<Mail className="absolute inset-s-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									required
									type="email"
									className="ps-9 h-11 text-sm"
									placeholder="name@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({
											...formData,
											email: e.target.value
										})
									}
								/>
							</div>
						</div>
					)}

					{/* Username/Email Input */}
					<div>
						<label className="text-xs font-medium mb-1 block">
							{t("usernameOrEmail")}
						</label>
						<div className="relative">
							<User className="absolute inset-s-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								required
								className="ps-9 h-11 text-sm"
								placeholder={t("usernamePlaceholder")}
								value={formData.username}
								onChange={(e) =>
									setFormData({
										...formData,
										username: e.target.value
									})
								}
							/>
						</div>
					</div>

					{/* Password Input */}
					<div>
						<div className="flex items-center justify-between mb-1">
							<label className="text-xs font-medium">
								{t("password")}
							</label>
						</div>
						<div className="relative">
							<Lock className="absolute inset-s-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								required
								type={showPassword ? "text" : "password"}
								className="ps-9 pe-9 h-11 text-sm"
								placeholder="••••••••"
								value={formData.password}
								onChange={(e) =>
									setFormData({
										...formData,
										password: e.target.value
									})
								}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-e-3 top-3 text-muted-foreground hover:text-foreground"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>
					{mode === "login" && (
						<button
							type="button"
							className="text-xs text-muted-foreground underline hover:text-primary"
						>
							{t("forgotPassword")}
						</button>
					)}

					<Button
						type="submit"
						size="lg"
						className="w-full font-medium mt-2"
					>
						{mode === "login" ? t("signIn") : t("createAccount")}
					</Button>
				</form>

				{/* Toggle Login/Sign Up Mode */}
				<div className="mt-4 text-center text-xs text-muted-foreground">
					{mode === "login" ? (
						<>
							{t("noAccount")}{" "}
							<button
								type="button"
								onClick={() => setMode("signup")}
								className="font-medium text-primary underline"
							>
								{t("signUp")}
							</button>
						</>
					) : (
						<>
							{t("hasAccount")}{" "}
							<button
								type="button"
								onClick={() => setMode("login")}
								className="font-medium text-primary underline"
							>
								{t("logIn")}
							</button>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
