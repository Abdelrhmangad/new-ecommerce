"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { UserProfile } from "../types/profile.types";

interface Props {
	profile: UserProfile;
	onAvatarChange: (file: File) => void;
}

export function ProfileHeader({ profile, onAvatarChange }: Props) {
	const t = useTranslations("Profile");
	const inputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState(profile.avatar);

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPreview(URL.createObjectURL(file));
		onAvatarChange(file);
	};

	const memberSince = new Date(profile.createdAt).toLocaleDateString(
		undefined,
		{
			year: "numeric",
			month: "long"
		}
	);

	return (
		<div className="flex items-center gap-5 rounded-xl border bg-background p-6 sm:gap-6 sm:p-8">
			{/* Avatar */}
			<div className="relative shrink-0">
				<div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-border sm:h-24 sm:w-24">
					{preview ? (
						<Image
							src={preview}
							alt={profile.firstName}
							fill
							className="object-cover"
							sizes="96px"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-muted">
							<User className="h-10 w-10 text-muted-foreground" />
						</div>
					)}
				</div>
				<Button
					variant="secondary"
					size="icon"
					className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full border-2 border-background shadow-sm"
					onClick={() => inputRef.current?.click()}
					aria-label={t("change_avatar")}
				>
					<Camera className="h-3.5 w-3.5" />
				</Button>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFile}
				/>
			</div>

			{/* Meta */}
			<div className="min-w-0">
				<h1 className="truncate text-xl font-medium sm:text-2xl">
					{profile.firstName} {profile.lastName}
				</h1>
				<p className="mt-1 truncate text-sm text-muted-foreground">
					{profile.email} · {profile.phone}
				</p>
				<p className="mt-1.5 text-xs text-muted-foreground">
					{t("member_since", { date: memberSince })}
				</p>
			</div>
		</div>
	);
}
