"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";

const CATEGORIES = [
	{ id: "T-Shirts", en: "T-Shirts", ar: "تيشيرتات" },
	{ id: "Outerwear", en: "Outerwear", ar: "ملابس خارجية" },
	{ id: "Hoodies", en: "Hoodies", ar: "هوديز" },
	{ id: "Pants", en: "Pants", ar: "بنطلونات" }
];

const SIZES = ["S", "M", "L", "XL", "XXL"];
export default function ProductsFilterContent({
	clearFilters
}: {
	clearFilters: () => void;
}) {
	const t = useTranslations("Products");
	const locale = useLocale() as "en" | "ar";
	// Filter States
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<"featured" | "low-high" | "high-low">(
		"featured"
	);
	// Filter Toggle Handlers
	const toggleCategory = (cat: string) => {
		setSelectedCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
		);
	};

	const toggleSize = (size: string) => {
		setSelectedSizes((prev) =>
			prev.includes(size)
				? prev.filter((s) => s !== size)
				: [...prev, size]
		);
	};

	return (
		<>
			<div className="space-y-6">
				{/* Category Filter */}
				<div>
					<h3 className="text-sm font-semibold mb-3">
						{t("categories")}
					</h3>
					<div className="space-y-2">
						{CATEGORIES.map((cat) => (
							<label
								key={cat.id}
								className="flex items-center gap-2 text-sm cursor-pointer"
							>
								<Checkbox
									checked={selectedCategories.includes(
										cat.id
									)}
									onCheckedChange={() =>
										toggleCategory(cat.id)
									}
								/>
								<span>{cat[locale]}</span>
							</label>
						))}
					</div>
				</div>

				<hr />

				{/* Size Filter */}
				<div>
					<h3 className="text-sm font-semibold mb-3">{t("size")}</h3>
					<div className="flex flex-wrap gap-2">
						{SIZES.map((size) => (
							<button
								key={size}
								onClick={() => toggleSize(size)}
								className={`h-8 w-8 rounded border text-xs font-medium transition-colors ${
									selectedSizes.includes(size)
										? "border-primary bg-primary text-primary-foreground"
										: "hover:border-primary/50"
								}`}
							>
								{size}
							</button>
						))}
					</div>
				</div>

				<hr />

				{/* Sort Dropdown */}
				<div>
					<h3 className="text-sm font-semibold mb-3">
						{t("sortBy")}
					</h3>
					<select
						value={sortBy}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setSortBy(
								e.target.value as
									| "featured"
									| "low-high"
									| "high-low"
							)
						}
						className="h-9 rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
					>
						<option value="featured">{t("new")}</option>
						<option value="low-high">
							{t("priceFromLowToHigh")}
						</option>
						<option value="high-low">{t("priceHighToLow")}</option>
					</select>
				</div>

				{/* Active Filters Clear Button */}
				{(selectedCategories.length > 0 ||
					selectedSizes.length > 0) && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="w-full text-xs gap-1"
					>
						<X className="h-3 w-3" /> Clear Filters
					</Button>
				)}
			</div>
		</>
	);
}
