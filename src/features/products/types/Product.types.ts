export interface ProductColorType {
    images: {
        primary: string;
        secondary: string;
        gallery: string[];
    };
    name: {
        en: string;
        ar: string;
    };
    hex: string;
}

export interface ProductVariantType {
    colorName: string;
    size: string;
    quantity: number;
    sku: string;
}

export interface ProductPropType {
    _id: string;
    name: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    slug: string;
    category: {
        name: {
            en: string;
            ar: string;
        },
        slug: string;
        id: string
    };
    price: number;
    sizes: string[];
    colors: ProductColorType[];
    variants: ProductVariantType[];
    isActive: boolean;
    compareAtPrice: number;
    isOnSale: boolean;
    isNew: boolean;
    discountPercentage: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
    totalStock: number;
    id: string;
}