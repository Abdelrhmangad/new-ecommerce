"use client";

import { Link } from "@/i18n/routing";
import useAuthStore from "@/store/user-store";
import { User, LogOut, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

export default function UserAvatarMenu() {
	const t = useTranslations();
	const { auth, logout } = useAuthStore();
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative inline-block" ref={menuRef}>
			{/* Clickable Avatar Trigger */}
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				className="focus:outline-none block rounded-full"
				aria-haspopup="true"
				aria-expanded={isOpen}
			>
				{auth.user?.picture ? (
					<div className="bg-gray-50 rounded-full overflow-hidden border border-border w-[30px] h-[30px] cursor-pointer hover:opacity-80 transition-opacity">
						<Image
							src={auth.user?.picture}
							width={30}
							height={30}
							alt="user avatar"
							className="object-cover w-full h-full"
						/>
					</div>
				) : (
					<div className="bg-gray-50 rounded-full overflow-hidden border border-border flex items-center justify-center w-[30px] h-[30px] cursor-pointer hover:bg-gray-100 transition-colors">
						<User
							className="w-[20px] h-[20px] text-gray-600"
							strokeWidth={1.4}
						/>
					</div>
				)}
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
					<Link
						href="/profile"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
					>
						<UserCheck className="w-4 h-4" />
						<span>{t("profile")}</span>
					</Link>

					<button
						onClick={() => {
							setIsOpen(false);
							if (logout) logout();
						}}
						className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
					>
						<LogOut className="w-4 h-4" />
						<span>{t("Auth.logout")}</span>
					</button>
				</div>
			)}
		</div>
	);
}
