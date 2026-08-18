export interface ProductPropType {
    id: string;
    name: {
        en: string;
        ar: string;
    };
    price: number;
    compareAtPrice?: number;
    category: {
        en: string;
        ar: string;
    };
    images: string[];
    colors: { name: string; hex: string }[];
    sizes: string[];
    isNew?: boolean;
}