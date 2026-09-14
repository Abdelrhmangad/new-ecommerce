"use client";
import React, { useEffect } from "react";
import { useUserData } from "../queries/user.queries";
import useAuthStore from "@/store/user-store";

export default function UserDataRefresher() {
	const { login } = useAuthStore();
	const { data, isError } = useUserData();
	useEffect(() => {
		if (data && data.user) {
			login(data.user);
		}

		if (isError) {
		}
	}, [data]);

	return null;
}
