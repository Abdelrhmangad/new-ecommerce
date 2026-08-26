import { useState, useMemo, useCallback } from "react";
import { egyptGovernorates } from "../data/governorates.data";

export const useEgyptLocations = (options?: UseEgyptLocationsOptions) => {
	const [selectedGovId, setSelectedGovId] = useState<string>(
		options?.initialGovernorateId || ""
	);
	const [selectedCityName, setSelectedCityName] = useState<string>("");

	const [govSearchTerm, setGovSearchTerm] = useState<string>("");
	const [citySearchTerm, setCitySearchTerm] = useState<string>("");

	// Get current active governorate object
	const selectedGovernorate = useMemo<Governorate | undefined>(() => {
		return egyptGovernorates.find((gov) => gov.id === selectedGovId);
	}, [selectedGovId]);

	// Handle Governorate Selection (Resets city state automatically)
	const selectGovernorate = useCallback((govId: string) => {
		setSelectedGovId(govId);
		setSelectedCityName(""); // Reset city when governorate changes
		setCitySearchTerm("");
	}, []);

	// Filter Governorates based on Arabic or English search input
	const filteredGovernorates = useMemo(() => {
		if (!govSearchTerm.trim()) return egyptGovernorates;

		const term = normalizeArabic(govSearchTerm);
		return egyptGovernorates.filter((gov) => {
			const matchEn = gov.nameEn.toLowerCase().includes(term);
			const matchAr = normalizeArabic(gov.nameAr).includes(term);
			return matchEn || matchAr;
		});
	}, [govSearchTerm]);

	// Filter Cities of the selected Governorate based on Arabic or English search input
	const filteredCities = useMemo(() => {
		if (!selectedGovernorate) return [];
		if (!citySearchTerm.trim()) return selectedGovernorate.cities;

		const term = normalizeArabic(citySearchTerm);
		return selectedGovernorate.cities.filter((city) => {
			const matchEn = city.nameEn.toLowerCase().includes(term);
			const matchAr = normalizeArabic(city.nameAr).includes(term);
			return matchEn || matchAr;
		});
	}, [selectedGovernorate, citySearchTerm]);

	// Get currently selected city object
	const selectedCity = useMemo<City | undefined>(() => {
		if (!selectedGovernorate) return undefined;
		return selectedGovernorate.cities.find(
			(c) =>
				c.nameEn === selectedCityName || c.nameAr === selectedCityName
		);
	}, [selectedGovernorate, selectedCityName]);

	const resetAll = useCallback(() => {
		setSelectedGovId("");
		setSelectedCityName("");
		setGovSearchTerm("");
		setCitySearchTerm("");
	}, []);

	return {
		// Selection state
		selectedGovId,
		selectedGovernorate,
		selectedCityName,
		selectedCity,

		// Raw/Filtered lists for Select options
		governorates: filteredGovernorates,
		cities: filteredCities,

		// Search state & handlers
		govSearchTerm,
		setGovSearchTerm,
		citySearchTerm,
		setCitySearchTerm,

		// Action setters
		selectGovernorate,
		selectCity: setSelectedCityName,
		resetAll
	};
};

export interface City {
	nameEn: string;
	nameAr: string;
}

export interface Governorate {
	id: string;
	nameEn: string;
	nameAr: string;
	capital: City;
	cities: City[];
}

/**
 * Normalizes Arabic text to handle common spelling variations during search.
 */
export const normalizeArabic = (text: string): string => {
	return text
		.replace(/[أإآ]/g, "ا")
		.replace(/ة/g, "ه")
		.replace(/ى/g, "ي")
		.replace(/[\u064B-\u0652]/g, "") // remove diacritics
		.toLowerCase()
		.trim();
};

interface UseEgyptLocationsOptions {
	initialGovernorateId?: string;
}
