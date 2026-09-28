"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { AddressForm } from "@/features/profile/components/AddressForm";
import { OrdersList } from "@/features/profile/components/OrdersList";
import { PasswordForm } from "@/features/profile/components/PasswordForm";
import { Button } from "@/components/ui/button";

import { ProfileHeader } from "@/features/profile/components/profileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserOrders } from "@/features/orders/queries/orders.queries";
import useAuthStore from "@/store/user-store";
import { useEffect } from "react";
import { redirect } from "@/i18n/routing";
import { useChangeUserPassword } from "@/features/user/queries/user.queries";

export default function ProfilePage() {
	const t = useTranslations("Profile");
	const locale = useLocale() as "en" | "ar";
	const router = useRouter();
	const { auth } = useAuthStore();
	useEffect(() => {
		if (!auth?.isAuthenticated) {
			console.log(
				"No user found redirecting to homepage",
				auth?.isAuthenticated
			);
			router.replace("/");
		}
	}, [auth?.isAuthenticated, router]);
	console.log("auth", auth);
	const { data } = useUserOrders({ page: 1 });
	const orders = data?.orders;
	const ordersMeta = data?.meta;
	const handleAvatarChange = async (file: File) => {
		// TODO: upload to your storage (S3, Cloudinary, etc.)
		const formData = new FormData();
		formData.append("avatar", file);
		toast.success(t("avatar_updated"));
	};

	const handleReorder = (orderId: string) => {
		const order = orders?.find((o) => o._id === orderId);
		if (!order) return;
		// TODO: add items to cart via your store
		toast.success(t("reorder_success"));
		router.push(`/${locale}/cart`);
	};

	const { mutateAsync: changePassword } = useChangeUserPassword();
	const handleChangePassword = async (data: {
		current: string;
		newPass: string;
		confirm: string;
	}) => {
		changePassword({
			old_password: data?.current,
			new_password: data?.newPass
		});
		// TODO: POST /api/auth/change-password
		toast.success(t("password_changed"));
	};

	const handleDeleteAccount = () => {
		const confirmed = window.confirm(t("delete_confirm"));
		if (!confirmed) return;
		// TODO: DELETE /api/account
		toast.success(t("account_deleted"));
		router.push(`/${locale}`);
	};

	return (
		<div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-3xl mx-auto">
				<ProfileHeader onAvatarChange={handleAvatarChange} />

				<div className="mt-6">
					<ProfileStats
						ordersCount={ordersMeta?.totalOrders || 0}
						deliveredCount={
							orders?.filter((o) => o.status === "delivered")
								.length || 0
						}
						totalSpent={ordersMeta?.totalAmountSpent || 0}
					/>
				</div>

				<Tabs defaultValue="orders" className="mt-8">
					<TabsList className="w-full justify-start space-x-1 rounded-xl bg-transparent p-0">
						<TabsTrigger
							value="orders"
							className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:shadow-sm"
						>
							{t("tab_orders")}
						</TabsTrigger>
						<TabsTrigger
							value="profile"
							className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:shadow-sm"
						>
							{t("tab_profile")}
						</TabsTrigger>
						<TabsTrigger
							value="settings"
							className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:shadow-sm"
						>
							{t("tab_settings")}
						</TabsTrigger>
					</TabsList>

					{/* Orders */}
					<TabsContent value="orders" className="mt-6">
						<OrdersList onReorder={handleReorder} />
					</TabsContent>

					{/* Profile */}
					<TabsContent value="profile" className="mt-6 space-y-6">
						<div className="rounded-xl border bg-background p-5 sm:p-6">
							<h2 className="mb-5 text-base font-medium">
								{t("personal_info")}
							</h2>
							<ProfileForm />
						</div>

						<div className="rounded-xl border bg-background p-5 sm:p-6">
							<h2 className="mb-5 text-base font-medium">
								{t("default_address")}
							</h2>
							<AddressForm />
						</div>
					</TabsContent>

					{/* Settings */}
					<TabsContent value="settings" className="mt-6 space-y-6">
						<div className="rounded-xl border bg-background p-5 sm:p-6">
							<h2 className="mb-5 text-base font-medium">
								{t("password")}
							</h2>
							<PasswordForm
								onChangePassword={handleChangePassword}
							/>
						</div>

						<div className="rounded-xl border border-destructive/20 bg-background p-5 sm:p-6">
							<h2 className="mb-2 text-base font-medium text-destructive">
								{t("danger_zone")}
							</h2>
							<p className="mb-4 text-sm text-muted-foreground">
								{t("delete_warning")}
							</p>
							<Button
								variant="outline"
								className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
								onClick={handleDeleteAccount}
							>
								{t("delete_account")}
							</Button>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
