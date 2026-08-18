import { ProductPropType } from "../types/Product.types";

export const DUMMY_PRODUCTS: ProductPropType[] = [
    {
        id: "prod-1",
        name: {
            en: "Heavyweight Oversized Tee",
            ar: "تيشيرت أوفرسيز ثقيل"
        },
        price: 450,
        compareAtPrice: 550,
        category: {
            en: "T-Shirts",
            ar: "تيشيرتات"
        },
        images: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"
        ],
        colors: [
            { name: "Black", hex: "#18181b" },
            { name: "White", hex: "#f4f4f5" },
            { name: "Olive", hex: "#3f4e38" }
        ],
        sizes: ["S", "M", "L", "XL"],
        isNew: true
    },
    {
        id: "prod-2",
        name: {
            en: "Relaxed Fit Denim Jacket",
            ar: "جاكيت جينز مريح"
        },
        price: 1200,
        category: {
            en: "Outerwear",
            ar: "ملابس خارجية"
        },
        images: [
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&auto=format&fit=crop&q=80"
        ],
        colors: [
            { name: "Washed Blue", hex: "#4a6b82" },
            { name: "Raw Black", hex: "#222222" }
        ],
        sizes: ["M", "L", "XL"],
        isNew: false
    },
    {
        id: "prod-3",
        name: {
            en: "Minimalist Fleece Hoodie",
            ar: "هودي ميلتون بسيط"
        },
        price: 850,
        compareAtPrice: 980,
        category: {
            en: "Hoodies",
            ar: "هوديز"
        },
        images: [
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"
        ],
        colors: [
            { name: "Beige", hex: "#d7c4b7" },
            { name: "Grey", hex: "#9ca3af" },
            { name: "Black", hex: "#18181b" }
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        isNew: true
    },
    {
        id: "prod-4",
        name: {
            en: "Pleated Wide-Leg Trousers",
            ar: "بنطال واسع بكسرات"
        },
        price: 950,
        category: {
            en: "Pants",
            ar: "بنطلونات"
        },
        images: [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80"
        ],
        colors: [
            { name: "Charcoal", hex: "#374151" },
            { name: "Brown", hex: "#5c4033" }
        ],
        sizes: ["S", "M", "L"],
        isNew: false
    }
];