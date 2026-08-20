import { ProductPropType } from "./Product.types";

export type SingleCategoryType = {
    _id: string;
    name: {
        en: string;
        ar: string;
    };
    products: ProductPropType[];
    slug: string;
    icon: string;
}