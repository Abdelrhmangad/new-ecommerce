import toast from "react-hot-toast";
import { CartItem } from "../types/Cart.types";
import { ProductPropType } from "../types/Product.types";

const LOCALSTORAGE_CART_KEY = "user_cart"

type CombinedType = ProductPropType & { selectedSku: string, quantity: number, selectedColorHex: string }

export function addPdtToCart(pdtData: CombinedType) {
    console.log("addPdtToCart called function called", pdtData)
    const cart = JSON.parse(localStorage.getItem(LOCALSTORAGE_CART_KEY) ?? '{"items":[]}') as { items: CartItem[] }
    const existingItem = cart.items.find((item) => item.variantSku === pdtData.selectedSku);

    if (existingItem) {
        // Update quantity if item already exists in cart
        existingItem.quantity += pdtData.quantity;
    } else {
        const pdtVariantData = pdtData.variants.find(variant => variant.sku === pdtData?.selectedSku)
        const pdtColorObj = pdtData.colors.find(color => color.hex === pdtData?.selectedColorHex);
        const primaryImg = pdtColorObj?.images?.primary || pdtColorObj?.images?.secondary

        const newItem: CartItem = {
            variantSku: pdtData.selectedSku,
            productId: pdtData._id ?? pdtData.id,
            name: pdtData.name,
            price: pdtData.price,
            size: pdtVariantData?.size || '',
            colorName: pdtVariantData?.colorName || "",
            colorHex: pdtData.selectedColorHex,
            image: primaryImg || "",
            quantity: Math.min(pdtData.quantity, pdtVariantData?.quantity || 0),
            maxStock: pdtVariantData?.quantity || 0,
        };
        cart.items.push(newItem);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem(LOCALSTORAGE_CART_KEY, JSON.stringify(cart));
} 