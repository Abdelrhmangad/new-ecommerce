import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { useEgyptLocations } from "@/shared/hooks/useEgyptLocations";

export interface EgyptLocationSelectorProps {
	governorateValue?: string;
	cityValue?: string;
	onGovernorateChange: (value: string) => void;
	onCityChange: (value: string) => void;
	governorateError?: string;
	cityError?: string;
	governorateLabel?: string;
	cityLabel?: string;
	governoratePlaceholder?: string;
	cityPlaceholder?: string;
	className?: string;
}

export const EgyptLocationSelector: React.FC<EgyptLocationSelectorProps> = ({
	governorateValue = "",
	cityValue = "",
	onGovernorateChange,
	onCityChange,
	governorateError,
	cityError,
	governorateLabel = "Governorate / المحافظة",
	cityLabel = "City / المدينة",
	governoratePlaceholder = "Select Governorate / اختر المحافظة",
	cityPlaceholder = "Select City / اختر المدينة",
	className = "grid grid-cols-1 gap-4 sm:grid-cols-2"
}) => {
	const [openGov, setOpenGov] = React.useState(false);
	const [openCity, setOpenCity] = React.useState(false);

	const {
		governorates,
		cities,
		selectGovernorate,
		selectCity,
		govSearchTerm,
		setGovSearchTerm,
		citySearchTerm,
		setCitySearchTerm
	} = useEgyptLocations({
		initialGovernorateId: governorateValue
	});

	// Sync internal hook state if parent resets/changes value externally
	React.useEffect(() => {
		if (governorateValue !== undefined) {
			selectGovernorate(governorateValue);
		}
	}, [governorateValue, selectGovernorate]);

	const selectedGovObj = React.useMemo(
		() => governorates.find((g) => g.id === governorateValue),
		[governorates, governorateValue]
	);

	const selectedCityObj = React.useMemo(
		() =>
			cities.find(
				(c) => c.nameEn === cityValue || c.nameAr === cityValue
			),
		[cities, cityValue]
	);

	return (
		<div className={className}>
			{/* Governorate Selector */}
			<div className="space-y-1.5">
				<Label htmlFor="governorate-select">{governorateLabel}</Label>
				<Popover open={openGov} onOpenChange={setOpenGov}>
					<PopoverTrigger
						render={
							<Button
								id="governorate-select"
								variant="outline"
								role="combobox"
								aria-expanded={openGov}
								className={cn(
									"w-full justify-between font-normal h-10 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm! transition-colors outline-none",
									!governorateValue && "text-muted-foreground"
								)}
							>
								{selectedGovObj
									? `${selectedGovObj.nameEn} - ${selectedGovObj.nameAr}`
									: governoratePlaceholder}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						}
					></PopoverTrigger>
					<PopoverContent className="w-full p-0" align="start">
						<Command shouldFilter={false}>
							<CommandInput
								placeholder="Search / بحث..."
								value={govSearchTerm}
								onValueChange={setGovSearchTerm}
							/>
							<CommandList>
								<CommandEmpty>
									No governorate found.
								</CommandEmpty>
								<CommandGroup className="max-h-60 overflow-y-auto">
									{governorates.map((gov) => (
										<CommandItem
											key={gov.id}
											value={gov.id}
											onSelect={() => {
												selectGovernorate(gov.id);
												onGovernorateChange(gov.id);
												onCityChange(""); // Reset city in parent state
												setOpenGov(false);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													governorateValue === gov.id
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{gov.nameEn} - {gov.nameAr}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
				{governorateError && (
					<p className="text-xs text-destructive">
						{governorateError}
					</p>
				)}
			</div>

			{/* City Selector */}
			<div className="space-y-1.5">
				<Label htmlFor="city-select">{cityLabel}</Label>
				<Popover open={openCity} onOpenChange={setOpenCity}>
					<PopoverTrigger
						render={
							<Button
								id="city-select"
								variant="outline"
								role="combobox"
								aria-expanded={openCity}
								disabled={!governorateValue}
								className={cn(
									"w-full justify-between font-normal h-10 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm! transition-colors outline-none",
									!cityValue && "text-muted-foreground"
								)}
							>
								{selectedCityObj
									? `${selectedCityObj.nameEn} - ${selectedCityObj.nameAr}`
									: cityPlaceholder}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						}
					></PopoverTrigger>
					<PopoverContent className="w-full p-0" align="start">
						<Command shouldFilter={false}>
							<CommandInput
								placeholder="Search city / بحث المدينة..."
								value={citySearchTerm}
								onValueChange={setCitySearchTerm}
							/>
							<CommandList>
								<CommandEmpty>No city found.</CommandEmpty>
								<CommandGroup className="max-h-60 overflow-y-auto">
									{cities.map((city) => (
										<CommandItem
											key={city.nameEn}
											value={city.nameEn}
											onSelect={() => {
												selectCity(city.nameEn);
												onCityChange(city.nameEn);
												setOpenCity(false);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													cityValue === city.nameEn
														? "opacity-100"
														: "opacity-0"
												)}
											/>
											{city.nameEn} - {city.nameAr}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
				{cityError && (
					<p className="text-xs text-destructive">{cityError}</p>
				)}
			</div>
		</div>
	);
};
