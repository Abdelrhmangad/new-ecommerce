"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { AddressForm } from "@/features/profile/components/AddressForm";
import { OrdersList } from "@/features/profile/components/OrdersList";
import { PasswordForm } from "@/features/profile/components/PasswordForm";
import { Button } from "@/components/ui/button";

import { UserProfile, Order } from "@/features/profile/types/profile.types";
import { ProfileHeader } from "@/features/profile/components/profileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserOrders } from "@/features/orders/queries/orders.queries";

// ── Mock data ── replace with API calls
const mockProfile: UserProfile = {
	id: "usr_123",
	firstName: "Ahmed",
	lastName: "Hassan",
	email: "ahmed.hassan@email.com",
	phone: "01012345678",
	avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
	createdAt: "2024-01-15T00:00:00Z",
	defaultAddress: {
		governorate: "Cairo",
		city: "Nasr City",
		address: "14 Abbas El-Akkad St",
		building: "7",
		floor: "3"
	}
};

const mockOrders: Order[] = [
	{
		id: "ORD-A7X9K2M1",
		status: "delivered",
		createdAt: "2026-09-08T10:00:00Z",
		deliveredAt: "2026-09-10T14:00:00Z",
		items: [
			{
				variantSku: "TSHIRT-BLK-M",
				name: { en: "Premium Cotton T-Shirt", ar: "تيشيرت قطن فاخر" },
				price: 850,
				quantity: 2,
				image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"
			},
			{
				variantSku: "SHIRT-SND-L",
				name: { en: "Linen Summer Shirt", ar: "قميص صيفي كتان" },
				price: 1200,
				quantity: 1,
				image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop"
			}
		],
		total: 4250,
		shipping: 0
	},
	{
		id: "ORD-B3P7Q9R4",
		status: "shipped",
		createdAt: "2026-08-22T08:30:00Z",
		items: [
			{
				variantSku: "JACKET-DNM-XL",
				name: { en: "Classic Denim Jacket", ar: "جاكيت جينز كلاسيكي" },
				price: 1350,
				quantity: 1,
				image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=200&h=200&fit=crop"
			}
		],
		total: 1350,
		shipping: 0
	},
	{
		id: "ORD-C1M8N2P5",
		status: "pending",
		createdAt: "2026-09-11T09:00:00Z",
		items: [
			{
				variantSku: "HOODIE-GRY-M",
				name: { en: "Essential Hoodie", ar: "هودي أساسي" },
				price: 950,
				quantity: 1,
				image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop"
			}
		],
		total: 950,
		shipping: 0
	}
];

export default function ProfilePage() {
	const t = useTranslations("Profile");
	const locale = useLocale() as "en" | "ar";
	const router = useRouter();

	const [profile, setProfile] = useState<UserProfile>(mockProfile);
	const { data, isLoading } = useUserOrders({ page: 1 });
	const orders = data?.orders;

	const handleAvatarChange = async (file: File) => {
		// TODO: upload to your storage (S3, Cloudinary, etc.)
		const formData = new FormData();
		formData.append("avatar", file);
		toast.success(t("avatar_updated"));
	};

	const handleProfileSave = async (data: Partial<UserProfile>) => {
		// TODO: PATCH /api/profile
		setProfile((prev) => ({ ...prev, ...data }));
		toast.success(t("profile_updated"));
	};

	const handleAddressSave = async (
		data: NonNullable<UserProfile["defaultAddress"]>
	) => {
		// TODO: PATCH /api/profile/address
		setProfile((prev) => ({ ...prev, defaultAddress: data }));
		toast.success(t("address_updated"));
	};

	const handleReorder = (orderId: string) => {
		const order = orders?.find((o) => o._id === orderId);
		if (!order) return;
		// TODO: add items to cart via your store
		toast.success(t("reorder_success"));
		router.push(`/${locale}/cart`);
	};

	const handleChangePassword = async (data: {
		current: string;
		newPass: string;
		confirm: string;
	}) => {
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
						ordersCount={orders?.length || 0}
						deliveredCount={
							orders?.filter((o) => o.status === "delivered")
								.length || 0
						}
						totalSpent={
							orders
								?.filter((o) => o.status !== "cancelled")
								.reduce((sum, o) => sum + o.itemsTotal, 0) || 0
						}
					/>
				</div>

				<Tabs defaultValue="orders" className="mt-8">
					<TabsList className="w-full justify-start rounded-xl bg-transparent p-0">
						<TabsTrigger
							value="orders"
							className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							{t("tab_orders")}
						</TabsTrigger>
						<TabsTrigger
							value="profile"
							className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						>
							{t("tab_profile")}
						</TabsTrigger>
						<TabsTrigger
							value="settings"
							className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
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
							<ProfileForm onSave={handleProfileSave} />
						</div>

						<div className="rounded-xl border bg-background p-5 sm:p-6">
							<h2 className="mb-5 text-base font-medium">
								{t("default_address")}
							</h2>
							<AddressForm onSave={handleAddressSave} />
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
