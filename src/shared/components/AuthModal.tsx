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
import { GoogleLogin } from "@react-oauth/google";
import api from "../utils/axios.config";
import toast from "react-hot-toast";

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Later: Connect to Express backend authentication route
		console.log(`Submitting ${mode}:`, formData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			{/* Trigger Button to place in your Navbar */}
			<DialogTrigger render={<Button variant="default" size="lg" />}>
				{t("signIn")}
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
				<div className="grid grid-cols-1 gap-3 pt-2">
					<GoogleLogin
						onSuccess={async (credentialResponse) => {
							const idToken = credentialResponse.credential;
							if (!idToken) return;

							const res = await api.post("/google-login", {
								token: idToken
							});
							const data = res.data;
							if (res.status === 200) {
								toast.success(t("loggedInSuccess"));
								setIsOpen(false);
								console.log("|res login", res);
								console.log("|data login", data);
							}
						}}
						onError={() => {
							console.log("Login Failed");
						}}
					/>
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
