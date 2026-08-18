"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export interface BannerItem {
	id: string | number;
	title: string;
	description: string;
	imageUrl: string;
	buttonText?: string;
	buttonLink?: string;
}

interface BannerProps {
	items: BannerItem[];
}

export function ProductsBanner({ items }: BannerProps) {
	const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

	// Detect document text direction for RTL/LTR support dynamically
	useEffect(() => {
		const updateDir = () => {
			const documentDir = document.documentElement.dir || "ltr";
			setDir(documentDir as "ltr" | "rtl");
		};

		updateDir();

		// Listen for dir changes on <html> if dynamically toggled
		const observer = new MutationObserver(updateDir);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["dir"]
		});

		return () => observer.disconnect();
	}, []);

	if (!items || items.length === 0) return null;

	return (
		<div className="relative w-full container mx-auto overflow-hidden lg:rounded-xl shadow-lg group">
			{/* Key prop ensures Swiper updates seamlessly when direction changes */}
			<Swiper
				key={dir}
				dir={dir}
				modules={[Navigation, Pagination, Autoplay, EffectFade]}
				effect="fade"
				speed={800}
				loop={true}
				autoplay={{
					delay: 4000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true
				}}
				pagination={{
					clickable: true,
					el: ".custom-swiper-pagination",
					bulletClass: "custom-bullet",
					bulletActiveClass: "custom-bullet-active"
				}}
				navigation={{
					nextEl: ".banner-button-next",
					prevEl: ".banner-button-prev"
				}}
				className="w-full h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px]"
			>
				{items.map((item) => (
					<SwiperSlide
						key={item.id}
						className="relative w-full h-full"
					>
						{/* Background Image */}
						<Image
							src={item.imageUrl}
							alt={item.title}
							fill
							priority
							className="object-cover"
							sizes="(max-width: 1280px) 100vw, 1280px"
						/>

						{/* Gradient Overlay for Text Legibility */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent dark:from-black/90 dark:via-black/40" />

						{/* Slide Content */}
						<div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12 text-white ltr:text-left rtl:text-right">
							<div className="max-w-2xl space-y-2 sm:space-y-4">
								<h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
									{item.title}
								</h2>
								<p className="text-sm sm:text-base md:text-lg text-slate-200 line-clamp-2 drop-shadow">
									{item.description}
								</p>

								{item.buttonText && (
									<div className="pt-2">
										<a
											href={item.buttonLink || "#"}
											className="inline-flex items-center justify-center rounded-lg bg-white/90 text-slate-900 font-semibold px-5 py-2.5 text-sm sm:text-base transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
										>
											{item.buttonText}
										</a>
									</div>
								)}
							</div>
						</div>
					</SwiperSlide>
				))}

				{/* Custom Navigation Arrows */}
				<button
					aria-label="Previous Slide"
					className="banner-button-prev absolute top-1/2 -translate-y-1/2 start-4 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-0"
				>
					{dir === "rtl" ? (
						<ChevronRight className="h-6 w-6" />
					) : (
						<ChevronLeft className="h-6 w-6" />
					)}
				</button>

				<button
					aria-label="Next Slide"
					className="banner-button-next absolute top-1/2 -translate-y-1/2 end-4 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-0"
				>
					{dir === "rtl" ? (
						<ChevronLeft className="h-6 w-6" />
					) : (
						<ChevronRight className="h-6 w-6" />
					)}
				</button>

				{/* Custom Pagination Container */}
				<div className="custom-swiper-pagination absolute bottom-4 inset-x-0 z-10 flex justify-center items-center gap-2 pointer-events-none" />
			</Swiper>

			{/* Scoped CSS for Swiper Pagination Dots */}
			<style jsx global>{`
				.custom-bullet {
					width: 8px;
					height: 8px;
					background-color: rgba(255, 255, 255, 0.5);
					border-radius: 9999px;
					margin-bottom: 4px;
					cursor: pointer;
					transition: all 0.3s ease;
					pointer-events: auto;
				}
				.custom-bullet-active {
					width: 24px;
					background-color: #ffffff;
				}
			`}</style>
		</div>
	);
}
