"use client";

import useAuthStore from "@/store/user-store";
import { User, LogOut, UserCheck } from "lucide-react";
import Image from "next/image";
import { googleLogout } from "@react-oauth/google";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import api from "../utils/axios.config";
import { Link } from "@/i18n/routing";

export default function UserAvatarMenu() {
	const t = useTranslations();
	const { auth, logout } = useAuthStore();

	async function logoutAndClearSession() {
		try {
			await api.post("http://localhost:5000/api/auth/logout");
		} finally {
			logout?.();
			googleLogout();
		}
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button className="focus:outline-none rounded-full cursor-pointer hover:opacity-90 transition-opacity">
						{auth.user?.picture ? (
							<div className="bg-gray-50 rounded-full overflow-hidden border border-border size-8 flex items-center justify-center">
								<Image
									src={auth.user.picture}
									width={32}
									height={32}
									alt="user avatar"
									className="object-cover size-full"
								/>
							</div>
						) : (
							<div className="bg-gray-50 rounded-full border border-border size-8 flex items-center justify-center">
								<User
									className="size-5 text-gray-600"
									strokeWidth={1.4}
								/>
							</div>
						)}
					</button>
				}
			></DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem
					render={
						<Link
							href="/profile"
							className="w-full flex items-center gap-2 cursor-pointer"
						>
							<UserCheck className="size-4" />
							<span>{t("profile")}</span>
						</Link>
					}
				></DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => logoutAndClearSession()}
					className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
				>
					<LogOut className="size-4" />
					<span>{t("Auth.logout")}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
