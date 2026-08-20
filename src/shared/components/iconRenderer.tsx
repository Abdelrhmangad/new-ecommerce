// components/CategoryIcon.tsx
import React from "react";
import * as Icons from "lucide-react";

interface CategoryIconProps {
	name: string;
	className?: string;
	size?: number;
}

export const IconRenderer: React.FC<CategoryIconProps> = ({
	name,
	className = "w-5 h-5",
	size = 20
}) => {
	// Dynamically resolve the component from lucide-react exports
	const IconComponent =
		(Icons as unknown as Record<string, React.ElementType>)[name] ||
		Icons.Folder;

	return <IconComponent className={className} size={size} />;
};
