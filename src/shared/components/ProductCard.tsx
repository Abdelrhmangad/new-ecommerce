import { useTranslations } from "next-intl";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductProps {
	id: string;
	name: string;
	price: number;
	category: string;
}

export default function ProductCard({ name, price, category }: ProductProps) {
	const t = useTranslations("Products");

	return (
		<Card className="flex flex-col justify-between h-full hover:shadow-md transition-shadow">
			<CardHeader className="p-4">
				<span className="text-xs text-muted-foreground uppercase tracking-wider">
					{category}
				</span>
				<CardTitle className="text-lg mt-1">{name}</CardTitle>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<div className="h-32 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm">
					Placeholder
				</div>
			</CardContent>
			<CardFooter className="p-4 pt-0 flex items-center justify-between">
				<span className="font-semibold">{t("price", { price })}</span>
				<Button size="sm">{t("addToCart")}</Button>
			</CardFooter>
		</Card>
	);
}
