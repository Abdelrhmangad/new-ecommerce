"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false
		}
	}
});

export default function ProviderWrappers({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<GoogleOAuthProvider
			clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
		>
			<QueryClientProvider client={queryClient}>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
				<Toaster />
			</QueryClientProvider>
		</GoogleOAuthProvider>
	);
}
